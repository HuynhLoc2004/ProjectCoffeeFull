package com.example.ProJectBackWeb.Service;

import com.example.ProJectBackWeb.EnumStatus.HttpStatusEnum;
import com.example.ProJectBackWeb.Exception.Appexception;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageService {
        public Resource getImage(String file) throws MalformedURLException {
            Path path = Paths.get("D:\\IMGPROJECT\\IMAGE_PRODUCT\\"+file);
            if(!Files.exists(path)){
               throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "Not found image" );
            }
            Resource resource = new UrlResource(path.toUri());
            return resource;
        }

        public Resource findImgUser(String file) throws MalformedURLException {
            Path path = Paths.get("D:\\IMGUSER\\"+file);

            if(!Files.exists(path)){
                throw new Appexception(HttpStatusEnum.NOT_FOUND.getCode(), "Not found image" );
            }

            Resource resource = new UrlResource(path.toUri());
            return resource;
        }
}
