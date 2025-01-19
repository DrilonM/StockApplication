package com.sentimetsaccessapi.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsSentimentsKey implements Serializable {
    private String issuer;
    private String date;
    private String title;
}
