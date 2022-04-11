package com.iora.erp;

import java.io.InputStream;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iora.erp.data.DataLoader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@SpringBootApplication
public class ErpApplication {

	public static void main(String[] args) {
		SpringApplication.run(ErpApplication.class, args);
	}

	@Autowired
	private ResourceLoader resourceLoader;

	// read json and write to db
	@Bean
	CommandLineRunner runner(DataLoader dataLoader) {
		return args -> {

			ObjectMapper mapper = new ObjectMapper();
			TypeReference<List<Object>> typeReference = new TypeReference<List<Object>>() {
			};
			Resource resource = resourceLoader.getResource("classpath:com/iora/erp/data/products_test.json");
			InputStream inputStream = resource.getInputStream();
			try {
				List<Object> productsJSON = mapper.readValue(inputStream, typeReference);
				dataLoader.loadProducts(productsJSON);
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println("Unable to save products: " + e.getMessage());
			}
		};
	}
}
