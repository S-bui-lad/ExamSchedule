package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.User;
import com.exam.Scheduler.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    private UserService userService;
    public UserController(UserService userService){
        this.userService = userService;
    }
    @PostMapping("/user/create")
    public User createNewUser(@RequestBody User user){

       User sonUser = this.userService.handleCreateUser(user);
        return sonUser;
    }

    @DeleteMapping("/user/delete/{id}")
    public String deleteUser(@PathVariable("id") long id){
        this.userService.handleDeleteUser(id);
        return "deleteUser";
    }

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable("id") long id){
        return this.userService.fetchUserById(id);
    }

    @GetMapping("/user")
    public List<User> getAllUser(){
        return this.userService.fetchAllUser();
    }

    @PutMapping("/user")
    public User updateUser(@RequestBody User user){
        User sonUser = this.userService.handleUpdateUser(user);
        return sonUser;
    }

}
