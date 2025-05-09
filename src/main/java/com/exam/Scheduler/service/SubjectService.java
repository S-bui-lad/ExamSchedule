package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.Subject;
import com.exam.Scheduler.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {
    private SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository){
        this.subjectRepository = subjectRepository;
    }

    public Subject handleCreateSubject(Subject subject){
        return this.subjectRepository.save(subject);
    }

    public void handleDeleteSubject(long id){
        this.subjectRepository.deleteById(id);
    }

    public void deleteAllSubjects() {
        subjectRepository.deleteAll();
    }

    public Subject fetchSubjectById(long id){
        Optional<Subject> subjectOptional = this.subjectRepository.findById(id);
        if (subjectOptional.isPresent()){
            return subjectOptional.get();
        }
        return null;
    }
    public List<Subject> fetchAllSubject(){
        return this.subjectRepository.findAll();
    }

    public Subject handleUpdateSubject(Subject reqSubject){
        Subject currentSubject = this.fetchSubjectById(reqSubject.getId());
        if (currentSubject != null){
            currentSubject.setMaMon(reqSubject.getMaMon());
            currentSubject.setNest(reqSubject.getNest());
            currentSubject.setNhom(reqSubject.getNhom());
            currentSubject.setHinhthuc(reqSubject.getHinhthuc());

            currentSubject = this.subjectRepository.save(currentSubject);
        }
        return currentSubject;
    }
}
