<?php
/**
 * Database Configuration
 * WPCodingPress PHP API
 */

// Database credentials from cPanel
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'thecodin_wpcodingpress');
define('DB_USER', 'thecodin_wppress_db');
define('DB_PASS', 'thecodin_wppress_db');
define('DB_CHARSET', 'utf8mb4');

/**
 * Get PDO Database Connection
 * Singleton pattern for efficient connections
 */
function getDBConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET,
                PDO::MYSQL_ATTR_FOUND_ROWS => true
            ];
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            
        } catch (PDOException $e) {
            error_log("Database Connection Error: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
    
    return $pdo;
}

/**
 * Execute a prepared statement query
 * 
 * @param string $sql SQL query with placeholders
 * @param array $params Parameters for the query
 * @return PDOStatement
 */
function dbQuery($sql, $params = []) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        error_log("Query Error: " . $e->getMessage() . " | SQL: " . $sql);
        throw new Exception("Database query failed");
    }
}

/**
 * Fetch single row
 */
function dbFetchOne($sql, $params = []) {
    $stmt = dbQuery($sql, $params);
    return $stmt->fetch();
}

/**
 * Fetch all rows
 */
function dbFetchAll($sql, $params = []) {
    $stmt = dbQuery($sql, $params);
    return $stmt->fetchAll();
}

/**
 * Insert and return last insert ID
 */
function dbInsert($sql, $params = []) {
    dbQuery($sql, $params);
    return getDBConnection()->lastInsertId();
}

/**
 * Update or Delete and return affected rows
 */
function dbExecute($sql, $params = []) {
    $stmt = dbQuery($sql, $params);
    return $stmt->rowCount();
}

/**
 * Begin Transaction
 */
function dbBeginTransaction() {
    return getDBConnection()->beginTransaction();
}

/**
 * Commit Transaction
 */
function dbCommit() {
    return getDBConnection()->commit();
}

/**
 * Rollback Transaction
 */
function dbRollback() {
    return getDBConnection()->rollBack();
}
