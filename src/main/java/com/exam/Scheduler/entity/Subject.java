package com.exam.Scheduler.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

@Entity
@Data
@Table(name = "Subject")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String maMon;
    private String tenMon;
    private String soTinChi;
    private String hocKy;
    private String namHoc;
    private String soLuongSinhVien;
    private String gv1;
    private String gv2;
    private String thoiGianThi;
    private String phongThi;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaMon() {
        return maMon;
    }

    public void setMaMon(String maMon) {
        this.maMon = maMon;
    }

    public String getTenMon() {
        return tenMon;
    }

    public void setTenMon(String tenMon) {
        this.tenMon = tenMon;
    }

    public String getSoTinChi() {
        return soTinChi;
    }

    public void setSoTinChi(String soTinChi) {
        this.soTinChi = soTinChi;
    }

    public String getHocKy() {
        return hocKy;
    }

    public void setHocKy(String hocKy) {
        this.hocKy = hocKy;
    }

    public String getNamHoc() {
        return namHoc;
    }

    public void setNamHoc(String namHoc) {
        this.namHoc = namHoc;
    }

    public String getSoLuongSinhVien() {
        return soLuongSinhVien;
    }

    public void setSoLuongSinhVien(String soLuongSinhVien) {
        this.soLuongSinhVien = soLuongSinhVien;
    }

    public String getGv1() {
        return gv1;
    }

    public void setGv1(String gv1) {
        this.gv1 = gv1;
    }

    public String getGv2() {
        return gv2;
    }

    public void setGv2(String gv2) {
        this.gv2 = gv2;
    }

    public String getThoiGianThi() {
        return thoiGianThi;
    }

    public void setThoiGianThi(String thoiGianThi) {
        this.thoiGianThi = thoiGianThi;
    }

    public String getPhongThi() {
        return phongThi;
    }

    public void setPhongThi(String phongThi) {
        this.phongThi = phongThi;
    }
}
