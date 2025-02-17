package com.exam.Scheduler.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ngay_thi")
public class Ngay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tenNgay;

    public Ngay() {}

    public Ngay(String tenNgay) {
        this.tenNgay = tenNgay;
    }

    public Long getId() {
        return id;
    }

    public String getTenNgay() {
        return tenNgay;
    }

    public void setTenNgay(String tenNgay) {
        this.tenNgay = tenNgay;
    }
}
