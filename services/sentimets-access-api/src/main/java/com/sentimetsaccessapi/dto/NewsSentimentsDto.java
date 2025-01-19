package com.sentimetsaccessapi.dto;

import lombok.Data;

@Data
public class NewsSentimentsDto {
    private String issuer;
    private String link;
    private String date;
    private String title;
    private String content;
    private String sentiment;

    public NewsSentimentsDto() {}
}
