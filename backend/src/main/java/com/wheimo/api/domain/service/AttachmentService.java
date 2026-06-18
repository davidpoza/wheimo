package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.AttachmentDto;
import com.wheimo.api.domain.entity.Attachment;
import com.wheimo.api.domain.entity.Transaction;
import com.wheimo.api.domain.repository.AttachmentRepository;
import com.wheimo.api.domain.repository.TransactionRepository;
import com.wheimo.api.web.exception.ForbiddenException;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf"
    );

    private final AttachmentRepository attachmentRepository;
    private final TransactionRepository transactionRepository;

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
        Files.write(dir.resolve(filename), file.getBytes());

        Attachment attachment = Attachment.builder()
                .filename(filename)
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

    private AttachmentDto toDto(Attachment a) {
        return AttachmentDto.builder()
                .id(a.getId())
                .filename(a.getFilename())
                .description(a.getDescription())
                .type(a.getType())
                .transactionId(a.getTransaction() != null ? a.getTransaction().getId() : null)
                .createdAt(a.getCreatedAt())
                .build();
    }
}
