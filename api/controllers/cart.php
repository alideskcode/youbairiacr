<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST,GET,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Cart.php';

$database = new Database();
$db = $database->getConnection();

$cart = new Cart($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch($request_method) {
    case 'POST':
        // Add item to cart
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->user_id) &&
            !empty($data->product_id) &&
            !empty($data->quantity)
        ) {
            $cart->user_id = $data->user_id;
            $cart->product_id = $data->product_id;
            $cart->quantity = $data->quantity;

            if($cart->addToCart()) {
                http_response_code(201);
                echo json_encode(array("message" => "Item added to cart successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to add item to cart."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to add item. Data is incomplete."));
        }
        break;

    case 'GET':
        // Get cart items
        if(!empty($_GET['user_id'])) {
            $cart->user_id = $_GET['user_id'];
            $stmt = $cart->getCartItems();
            $num = $stmt->rowCount();

            if($num > 0) {
                $cart_arr = array();
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $cart_item = array(
                        "id" => $id,
                        "product_id" => $product_id,
                        "title" => $title,
                        "price" => $price,
                        "image" => $image,
                        "quantity" => $quantity
                    );
                    array_push($cart_arr, $cart_item);
                }
                http_response_code(200);
                echo json_encode($cart_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No items found in cart."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "User ID is required."));
        }
        break;

    case 'PUT':
        // Update cart item quantity
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->id) &&
            !empty($data->user_id) &&
            !empty($data->quantity)
        ) {
            $cart->id = $data->id;
            $cart->user_id = $data->user_id;
            $cart->quantity = $data->quantity;

            if($cart->updateQuantity()) {
                http_response_code(200);
                echo json_encode(array("message" => "Cart item updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update cart item."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to update item. Data is incomplete."));
        }
        break;

    case 'DELETE':
        // Remove item from cart
        $data = json_decode(file_get_contents("php://input"));
        
        if(
            !empty($data->id) &&
            !empty($data->user_id)
        ) {
            $cart->id = $data->id;
            $cart->user_id = $data->user_id;

            if($cart->removeItem()) {
                http_response_code(200);
                echo json_encode(array("message" => "Item removed from cart successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to remove item from cart."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to remove item. Data is incomplete."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?> 