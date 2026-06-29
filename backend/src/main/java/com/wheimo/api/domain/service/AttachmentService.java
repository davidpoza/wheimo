package com.wheimo.api.domain.service;

import com.wheimo.api.config.AttachmentImageProperties;
import com.wheimo.api.domain.dto.AttachmentDto;
import com.wheimo.api.domain.entity.Attachment;
import com.wheimo.api.domain.entity.Transaction;
import com.wheimo.api.domain.repository.AttachmentRepository;
import com.wheimo.api.domain.repository.TransactionRepository;
import com.wheimo.api.web.exception.ForbiddenException;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttachmentService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf"
    );
    private static final Set<String> IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    private final AttachmentRepository attachmentRepository;
    private final TransactionRepository transactionRepository;
    private final AttachmentImageProperties imageProperties;

    @Value("${app.attachments.path}")
    private String attachmentsPath;

    public AttachmentDto upload(Long userId, Long transactionId, MultipartFile file) throws IOException {
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("File type not allowed: " + file.getContentType());
        }
        Transaction transaction = transactionRepository.findByIdAndAccountUserId(transactionId, userId)
                .orElseThrow(() -> new ForbiddenException("Transaction not found or not owned by user"));

        String ext = file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")
                ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID() + ext;

        Path dir = Paths.get(attachmentsPath);
        Files.createDirectories(dir);

        byte[] fileBytes = optimizeIfImage(file.getBytes(), file.getContentType());
        Files.write(dir.resolve(filename), fileBytes);

        Attachment attachment = Attachment.builder()
                .filename(filename)
                .originalFilename(file.getOriginalFilename())
                .type(file.getContentType())
                .transaction(transaction)
                .build();
        return toDto(attachmentRepository.save(attachment));
    }

    public byte[] download(Long id, Long userId) throws IOException {
        Attachment attachment = attachmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Attachment not found"));
        Path path = Paths.get(attachmentsPath, attachment.getFilename());
        return Files.readAllBytes(path);
    }

    public byte[] downloadThumbnail(Long id, Long userId) throws IOException {
        Attachment attachment = attachmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Attachment not found"));
        if (!attachment.getType().startsWith("image/")) {
            throw new IllegalArgumentException("Thumbnails are only available for images");
        }
        Path sourceDir = Paths.get(attachmentsPath);
        Path thumbDir = sourceDir.resolve("thumbnails");
        Files.createDirectories(thumbDir);
        Path thumbPath = thumbDir.resolve(attachment.getFilename());
        if (!Files.exists(thumbPath)) {
            generateThumbnail(sourceDir.resolve(attachment.getFilename()), thumbPath);
        }
        return Files.readAllBytes(thumbPath);
    }

    public AttachmentDto getById(Long id, Long userId) {
        return toDto(attachmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Attachment not found")));
    }

    public AttachmentDto updateDescription(Long id, Long userId, String description) {
        Attachment attachment = attachmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Attachment not found"));
        attachment.setDescription(description);
        return toDto(attachmentRepository.save(attachment));
    }

    public void delete(Long id, Long userId) throws IOException {
        Attachment attachment = attachmentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Attachment not found"));
        Path path = Paths.get(attachmentsPath, attachment.getFilename());
        Files.deleteIfExists(path);
        attachmentRepository.delete(attachment);
    }

    private void generateThumbnail(Path sourcePath, Path thumbnailPath) throws IOException {
        BufferedImage original = ImageIO.read(sourcePath.toFile());
        if (original == null) {
            throw new IOException("Could not read source image for thumbnail");
        }
        int w = original.getWidth();
        int h = original.getHeight();
        int cropSize = Math.min(w, h);
        int x = (w - cropSize) / 2;
        int y = (h - cropSize) / 2;
        BufferedImage cropped = original.getSubimage(x, y, cropSize, cropSize);

        int size = imageProperties.getThumbnailSize();
        BufferedImage thumbnail = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = thumbnail.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.drawImage(cropped, 0, 0, size, size, null);
        g.dispose();

        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
        try (var outputStream = Files.newOutputStream(thumbnailPath);
             ImageOutputStream ios = ImageIO.createImageOutputStream(outputStream)) {
            writer.setOutput(ios);
            ImageWriteParam params = writer.getDefaultWriteParam();
            if (params.canWriteCompressed()) {
                params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                params.setCompressionQuality(Math.max(0f, Math.min(1f, imageProperties.getJpegQuality())));
            }
            writer.write(null, new IIOImage(thumbnail, null, null), params);
        } finally {
            writer.dispose();
        }
    }

    private byte[] optimizeIfImage(byte[] input, String mimeType) {
        if (!IMAGE_TYPES.contains(mimeType)) {
            return input;
        }
        try {
            return compressAndResize(input);
        } catch (Exception e) {
            log.warn("Image optimization failed, saving original: {}", e.getMessage());
            return input;
        }
    }

    private byte[] compressAndResize(byte[] input) throws IOException {
        BufferedImage original = ImageIO.read(new ByteArrayInputStream(input));
        if (original == null) {
            return input;
        }

        int origWidth = original.getWidth();
        int origHeight = original.getHeight();
        double scale = Math.min(1.0, Math.min(
                (double) imageProperties.getMaxWidth() / origWidth,
                (double) imageProperties.getMaxHeight() / origHeight
        ));

        BufferedImage toWrite;
        if (scale < 1.0) {
            int targetWidth = (int) Math.round(origWidth * scale);
            int targetHeight = (int) Math.round(origHeight * scale);
            BufferedImage resized = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = resized.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
            g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g.drawImage(original, 0, 0, targetWidth, targetHeight, null);
            g.dispose();
            toWrite = resized;
        } else {
            // No resize needed, but still convert to RGB for JPEG compatibility
            if (original.getType() != BufferedImage.TYPE_INT_RGB) {
                BufferedImage rgb = new BufferedImage(origWidth, origHeight, BufferedImage.TYPE_INT_RGB);
                Graphics2D g = rgb.createGraphics();
                g.drawImage(original, 0, 0, null);
                g.dispose();
                toWrite = rgb;
            } else {
                toWrite = original;
            }
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
        try (ImageOutputStream ios = ImageIO.createImageOutputStream(out)) {
            writer.setOutput(ios);
            ImageWriteParam params = writer.getDefaultWriteParam();
            if (params.canWriteCompressed()) {
                params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                params.setCompressionQuality(Math.max(0f, Math.min(1f, imageProperties.getJpegQuality())));
            }
            writer.write(null, new IIOImage(toWrite, null, null), params);
        } finally {
            writer.dispose();
        }
        return out.toByteArray();
    }

    private AttachmentDto toDto(Attachment a) {
        return AttachmentDto.builder()
                .id(a.getId())
                .filename(a.getFilename())
                .originalFilename(a.getOriginalFilename())
                .description(a.getDescription())
                .type(a.getType())
                .transactionId(a.getTransaction() != null ? a.getTransaction().getId() : null)
                .createdAt(a.getCreatedAt())
                .build();
    }
}
