package com.suman.Chat_App_Backend.controllers;

//import jakarta.annotation.PostConstruct;
//import jakarta.annotation.Resource;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
//import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173") // or your frontend origin
public class FileController {

	private final Path uploadDir = Paths.get("uploads");

	@PostConstruct
	public void init() throws IOException {
		if (!Files.exists(uploadDir)) {
			Files.createDirectories(uploadDir);
		}
	}

	@PostMapping("/upload")
	public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
		try {
			String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
			Path filePath = uploadDir.resolve(fileName);
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

			String fileUrl = "http://localhost:8080/api/files/" + fileName;
			return ResponseEntity.ok(Map.of("fileUrl", fileUrl, "fileName", file.getOriginalFilename()));
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "File upload failed"));
		}
	}

	@GetMapping("/{fileName}")
	public ResponseEntity<Resource> getFile(@PathVariable String fileName) throws IOException {
		Path filePath = uploadDir.resolve(fileName);
		if (!Files.exists(filePath)) {
			return ResponseEntity.notFound().build();
		}

		Resource resource = new UrlResource(filePath.toUri());
		String contentType = Files.probeContentType(filePath);

		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
				.body(resource);
	}
}

