package com.exam.Scheduler.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Getter
    private String MGV;
    private String name;
    private boolean status;
    private String khoa;
    private int isRemove=0;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKhoa() {
        return khoa;
    }

    public void setMGV(String MGV) {
        this.MGV = MGV;
    }

    public String getMGV() {
        return MGV;
    }

    public void setKhoa(String khoa) {
        this.khoa = khoa;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}