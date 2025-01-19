package com.sentimetsaccessapi.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name="news_sentiments")
@NoArgsConstructor
@AllArgsConstructor
@IdClass(NewsSentimentsKey.class)
public class NewsSentiments {
    @Id
    private String issuer;
    private String link;
    @Id
    private String date;
    @Id
    private String title;
    private String content;
    private String sentiment;
}
