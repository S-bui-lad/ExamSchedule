package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.User;
import com.exam.Scheduler.service.UserService;
import com.exam.Scheduler.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    private UserService userService;
    private final JwtUtil jwtUtil;
    public UserController(UserService userService, JwtUtil jwtUtil){
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping("/users/create")
    public ResponseEntity<User> createUser(@RequestBody User user){

       User sonUser = this.userService.handleCreateUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(sonUser);
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") long id){
        this.userService.handleDeleteUser(id);
        return ResponseEntity.status(HttpStatus.OK).body("Delete User");
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") long id){
        User fetchUser = this.userService.fetchUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(fetchUser);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUser(){

        return ResponseEntity.status(HttpStatus.OK).body(this.userService.fetchAllUser());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable long id) {
        User updatedUser = userService.handleUpdateUser(id, user);
        return ResponseEntity.status(HttpStatus.OK).body(updatedUser);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User request) {
        boolean success = userService.register(request.getEmail(), request.getPassword(), request.getName());
        if (success) {
            return ResponseEntity.ok("Đăng ký thành công");
        } else {
            return ResponseEntity.badRequest().body("Email đã tồn tại");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        User user = userService.authenticateAndReturnUser(request.getEmail(), request.getPassword());
        if (user != null) {
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(token); // có thể trả về plain token hoặc wrap lại trong JSON
        } else {
            return ResponseEntity.status(401).body("Sai email hoặc mật khẩu");
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getUserProfileById(@PathVariable Long id) {
        User user = userService.fetchUserById(id);
        return ResponseEntity.ok(user);
    }

}
