package com.wheimo.api.web.controller;

import com.wheimo.api.domain.dto.AttachmentDto;
import com.wheimo.api.domain.service.AttachmentService;
import com.wheimo.api.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentDto> upload(
            @RequestParam Long transactionId,
            @RequestParam MultipartFile file) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attachmentService.upload(SecurityUtils.getCurrentUserId(), transactionId, file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) throws Exception {
        AttachmentDto meta = attachmentService.getById(id, SecurityUtils.getCurrentUserId());
        byte[] data = attachmentService.download(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, meta.getType())
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + meta.getFilename() + "\"")
                .body(data);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AttachmentDto> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(attachmentService.updateDescription(id, SecurityUtils.getCurrentUserId(), body.get("description")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
        attachmentService.delete(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
