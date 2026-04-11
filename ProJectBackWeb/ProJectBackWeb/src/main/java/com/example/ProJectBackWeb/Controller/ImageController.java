package com.example.ProJectBackWeb.Controller;

import com.example.ProJectBackWeb.ResponseData.ResponseData;
import com.example.ProJectBackWeb.Service.ImageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/image")
public class ImageController {
    private final ImageService imageService;
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }
    @GetMapping("/{file}")
    public ResponseEntity<Resource> getFileImage(@PathVariable String file) throws MalformedURLException {
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG)
                .body(this.imageService.getImage(file));
    }

    @GetMapping("get-imguser/{file}")
    public ResponseEntity<Resource> findImgUser(@PathVariable String file) throws MalformedURLException {
        return  ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(
                this.imageService.findImgUser(file)
        );
    }
}
