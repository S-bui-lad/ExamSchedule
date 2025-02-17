package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.Ngay;
import com.exam.Scheduler.repository.NgayRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NgayService {
    private final NgayRepository ngayRepository;

    public NgayService(NgayRepository ngayRepository) {
        this.ngayRepository = ngayRepository;
    }

    public List<Ngay> getAllNgayThi() {
        return ngayRepository.findAll();
    }

    public Ngay createNgayThi(String tenNgay) {
        return ngayRepository.save(new Ngay(tenNgay));
    }
}
