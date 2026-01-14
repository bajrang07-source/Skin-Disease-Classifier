<?php
class Database {
    private $host = "localhost";
    private $db_name = "team_griffin";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo json_encode(["message" => "Connection error: " . $exception->getMessage()]);
            exit();
        }

        return $this->conn;
    }
}
?>
