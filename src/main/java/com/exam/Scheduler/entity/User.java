package com.exam.Scheduler.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String name;
    private String email;
    private String password;
    @Id
    private long id;

    @OneToOne
    private Teacher teacher;
}
