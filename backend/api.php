<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/config.php';

function json_response($status, $payload) {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    if ($action === 'register') {
        $required = ['nombre','apellidos','email','password','fecha_nacimiento','altura_cm','peso_kg','genero'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                json_response(400, ['error' => "Falta el campo {$field}"]);
            }
        }

        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$input['email']]);
        if ($stmt->fetch()) {
            json_response(409, ['error' => 'El correo ya esta registrado']);
        }

        $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);
        $condiciones = isset($input['condiciones']) ? json_encode($input['condiciones']) : null;
        $otro = $input['otro'] ?? null;

        $stmt = $pdo->prepare('INSERT INTO users (nombre, apellidos, email, password_hash, fecha_nacimiento, altura_cm, peso_kg, genero, condiciones, otro) VALUES (?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([
          $input['nombre'],
          $input['apellidos'],
          $input['email'],
          $passwordHash,
          $input['fecha_nacimiento'],
          (int)$input['altura_cm'],
          (int)$input['peso_kg'],
          $input['genero'],
          $condiciones,
          $otro,
        ]);

        json_response(200, ['success' => true, 'user_id' => $pdo->lastInsertId()]);
    } elseif ($action === 'login') {
        if (empty($input['email']) || empty($input['password'])) {
            json_response(400, ['error' => 'Email y password requeridos']);
        }

        $stmt = $pdo->prepare('SELECT id, nombre, apellidos, password_hash FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$input['email']]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($input['password'], $user['password_hash'])) {
            json_response(401, ['error' => 'Credenciales invalidas']);
        }

        json_response(200, ['success' => true, 'user' => ['id' => $user['id'], 'nombre' => $user['nombre'], 'apellidos' => $user['apellidos'], 'email' => $input['email']]]);
    } elseif ($action === 'add_contact') {
        $required = ['user_id','nombre','apellidos','email','telefono'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                json_response(400, ['error' => "Falta el campo {$field}"]);
            }
        }
        $stmt = $pdo->prepare('INSERT INTO contacts (user_id, nombre, apellidos, email, telefono, relacion) VALUES (?,?,?,?,?,?)');
        $stmt->execute([
          (int)$input['user_id'],
          $input['nombre'],
          $input['apellidos'],
          $input['email'],
          $input['telefono'],
          $input['relacion'] ?? null,
        ]);
        json_response(200, ['success' => true, 'contact_id' => $pdo->lastInsertId()]);
    } elseif ($action === 'update_contact') {
        $required = ['id','user_id','nombre','apellidos','email','telefono'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                json_response(400, ['error' => "Falta el campo {$field}"]);
            }
        }
        $stmt = $pdo->prepare('UPDATE contacts SET nombre=?, apellidos=?, email=?, telefono=?, relacion=? WHERE id=? AND user_id=?');
        $stmt->execute([
          $input['nombre'],
          $input['apellidos'],
          $input['email'],
          $input['telefono'],
          $input['relacion'] ?? null,
          (int)$input['id'],
          (int)$input['user_id'],
        ]);
        json_response(200, ['success' => true]);
    } elseif ($action === 'delete_contact') {
        $required = ['id','user_id'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                json_response(400, ['error' => "Falta el campo {$field}"]);
            }
        }
        $stmt = $pdo->prepare('DELETE FROM contacts WHERE id = ? AND user_id = ? LIMIT 1');
        $stmt->execute([(int)$input['id'], (int)$input['user_id']]);
        json_response(200, ['success' => true]);
    } elseif ($action === 'get_user') {
        if (empty($_GET['id'])) {
            json_response(400, ['error' => 'id requerido']);
        }
        $stmt = $pdo->prepare('SELECT id, nombre, apellidos, email, fecha_nacimiento, altura_cm, peso_kg, genero, condiciones, otro FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([(int)$_GET['id']]);
        $user = $stmt->fetch();
        if (!$user) {
            json_response(404, ['error' => 'Usuario no encontrado']);
        }
        // Decodificar condiciones si es JSON
        if (!empty($user['condiciones'])) {
            $decoded = json_decode($user['condiciones'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $user['condiciones'] = $decoded;
            }
        } else {
            $user['condiciones'] = [];
        }
        json_response(200, ['success' => true, 'user' => $user]);
    } elseif ($action === 'update_user') {
        $required = ['id','nombre','apellidos','email','fecha_nacimiento','altura_cm','peso_kg','genero'];
        foreach ($required as $field) {
            if (empty($input[$field]) && $input[$field] !== '0') {
                json_response(400, ['error' => "Falta el campo {$field}"]);
            }
        }
        $condiciones = isset($input['condiciones']) ? json_encode($input['condiciones']) : null;
        $otro = $input['otro'] ?? null;
        $stmt = $pdo->prepare('UPDATE users SET nombre=?, apellidos=?, email=?, fecha_nacimiento=?, altura_cm=?, peso_kg=?, genero=?, condiciones=?, otro=? WHERE id=?');
        $stmt->execute([
            $input['nombre'],
            $input['apellidos'],
            $input['email'],
            $input['fecha_nacimiento'],
            (int)$input['altura_cm'],
            (int)$input['peso_kg'],
            $input['genero'],
            $condiciones,
            $otro,
            (int)$input['id'],
        ]);
        json_response(200, ['success' => true]);
    } elseif ($action === 'list_contacts') {
        if (empty($_GET['user_id'])) {
            json_response(400, ['error' => 'user_id requerido']);
        }
        $stmt = $pdo->prepare('SELECT id, nombre, apellidos, email, telefono, relacion, created_at FROM contacts WHERE user_id = ? ORDER BY created_at DESC');
        $stmt->execute([(int)$_GET['user_id']]);
        $rows = $stmt->fetchAll();
        json_response(200, ['success' => true, 'contacts' => $rows]);
    } else {
        json_response(404, ['error' => 'Accion no encontrada']);
    }
} catch (Exception $e) {
    json_response(500, ['error' => 'Error del servidor', 'details' => $e->getMessage()]);
}
