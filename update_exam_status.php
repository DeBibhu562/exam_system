<?php
session_start();
include('config.php'); // Include your database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['exam_id']) && isset($_POST['status'])) {
        $examId = intval($_POST['exam_id']);
        $status = $_POST['status'];
        
        // Assuming you have an instance of your class $exam and the updateExamStatus method
        $exam = new Exam($conn); // Initialize your class with the DB connection
        $exam->updateExamStatus($examId, $status);
        
        echo json_encode(array("status" => "success"));
    } else {
        echo json_encode(array("status" => "error", "message" => "Invalid parameters"));
    }
}
?>
