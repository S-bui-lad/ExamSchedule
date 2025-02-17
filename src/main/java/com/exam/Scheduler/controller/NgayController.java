package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.Ngay;
import com.exam.Scheduler.service.NgayService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngay-thi")
public class NgayController {
    private final NgayService ngayService;

    public NgayController(NgayService ngayService) {
        this.ngayService = ngayService;
    }

    @GetMapping
    public List<Ngay> getNgayThi() {
        return ngayService.getAllNgayThi();
    }

    @PostMapping
    public Ngay addNgayThi(@RequestBody Ngay ngay) {
        return ngayService.createNgayThi(ngay.getTenNgay());
    }
}
