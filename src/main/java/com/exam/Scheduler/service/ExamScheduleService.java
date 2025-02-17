package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.Ngay;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExamScheduleService {
    private List<Ngay> ngayThi;

    public ExamScheduleService() {
        this.ngayThi = new ArrayList<>();
        // Khởi tạo danh sách 14 ngày thi (ví dụ)
        for (int i = 1; i <= 14; i++) {
            ngayThi.add(new Ngay("Ngày " + i));
        }
    }

    public List<Ngay> getExamDays() {
        return new ArrayList<>(ngayThi); // Trả về bản sao danh sách
    }

    public List<Ngay> swapExamDays() {
        if (ngayThi.size() == 14) {
            List<Ngay> newList = new ArrayList<>(ngayThi);

            swap(newList, 1, 10);
            swap(newList, 3, 12);
            swap(newList, 5, 8);
            swap(newList, 7, 13);

            this.ngayThi = newList; // Cập nhật danh sách mới
        }
        return getExamDays();
    }

    private void swap(List<Ngay> list, int i, int j) {
        Ngay temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
}
