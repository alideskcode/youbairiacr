<?php
class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $title;
    public $description;
    public $price;
    public $image;
    public $category;
    public $seller;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    title = :title,
                    description = :description,
                    price = :price,
                    image = :image,
                    category = :category,
                    seller = :seller,
                    created_at = :created_at";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->seller = htmlspecialchars(strip_tags($this->seller));
        $this->created_at = date('Y-m-d H:i:s');

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":seller", $this->seller);
        $stmt->bindParam(":created_at", $this->created_at);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getProducts() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getProduct() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        return $stmt;
    }
}
?> 