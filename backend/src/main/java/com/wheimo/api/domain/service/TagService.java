package com.wheimo.api.domain.service;

import com.wheimo.api.domain.dto.TagDto;
import com.wheimo.api.domain.entity.Tag;
import com.wheimo.api.domain.entity.User;
import com.wheimo.api.domain.repository.TagRepository;
import com.wheimo.api.domain.repository.UserRepository;
import com.wheimo.api.web.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    public TagDto create(Long userId, String name) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        Tag tag = Tag.builder().name(name).user(user).build();
        return toDto(tagRepository.save(tag));
    }

    public List<TagDto> findAll(Long userId) {
        return tagRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    public TagDto findById(Long id, Long userId) {
        return toDto(getTag(id, userId));
    }

    public TagDto updateById(Long id, Long userId, String name) {
        Tag tag = getTag(id, userId);
        tag.setName(name);
        return toDto(tagRepository.save(tag));
    }

    public void deleteById(Long id, Long userId) {
        Tag tag = getTag(id, userId);
        tagRepository.delete(tag);
    }

    private Tag getTag(Long id, Long userId) {
        return tagRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Tag not found"));
    }

    public TagDto toDto(Tag tag) {
        return TagDto.builder()
                .id(tag.getId())
                .name(tag.getName())
                .createdAt(tag.getCreatedAt())
                .updatedAt(tag.getUpdatedAt())
                .build();
    }
}
