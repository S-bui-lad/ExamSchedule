package com.exam.Scheduler.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "Subject")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String maMon;
    private int isRemove = 0;
    private String tenMon;
    private String nhom;
    @ManyToMany(mappedBy = "danhSachMonHoc", cascade = CascadeType.REMOVE)
    private List<Student> danhSachSinhVien = new ArrayList<>();

    @OneToMany(mappedBy = "subject",cascade = CascadeType.REMOVE )
    private List<ExamSchedule> examSchedules;

    public String getNest() {
        return nest;
    }

    public void setNest(String nest) {
        this.nest = nest;
    }

    private String nest;
    private String hinhthuc;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<StudentExam> studentExams;

    public List<StudentExam> getStudentExams() {
        return studentExams;
    }

    public void setStudentExams(List<StudentExam> studentExams) {
        this.studentExams = studentExams;
    }

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

    public String getNhom() {
        return nhom;
    }

    public void setNhom(String nhom) {
        this.nhom = nhom;
    }

       public String getHinhthuc() {
        return hinhthuc;
    }

    public void setHinhthuc(String hinhthuc) {
        this.hinhthuc = hinhthuc;
    }
}
