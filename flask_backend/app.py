"""
====================================================================
DRISHTI - Delivery & Driver Module
An Agriculture & Farmer-Support Platform
====================================================================
Technology Stack:
- Python & Flask (Backend Web Framework)
- SQLite3 (Relational Database)
- Leaflet.js & OpenStreetMap (Free, Open-Source Interactive Maps)
- Vanilla HTML5, CSS3, JavaScript (Clean, Responsive Frontend)
====================================================================
"""

import os
import sys
import sqlite3
from functools import wraps
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash

# Ensure utf-8 output on Windows consoles
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

app = Flask(__name__)
# Secret key used for session management (keeping driver logged in)
app.secret_key = 'drishti_farmer_support_secret_key_2026'

# Path to the SQLite database file (same directory as app.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'database.db')

# ==================================================================
# DELIVERY STATUS LIFECYCLE
# These 7 stages represent the complete lifecycle of a farm delivery
# ==================================================================
STATUS_STAGES = [
    'Order Placed',
    'Payment Completed',
    'Driver Assigned',
    'Driver Accepted',
    'Picked Up',
    'Out for Delivery',
    'Delivered'
]

# Database helper functions
def get_db():
    """Connects to SQLite database and configures row factory for dict-like access."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """
    Creates tables if they do not exist, and inserts default demo records.
    Runs automatically when app starts.
    """
    conn = get_db()
    cursor = conn.cursor()

    # 1. DRIVERS TABLE
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS drivers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            driver_code TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            status TEXT DEFAULT 'Available'
        )
    ''')

    # 2. ORDERS TABLE
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            product TEXT NOT NULL,
            quantity TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            customer_phone TEXT,
            pickup_address TEXT NOT NULL,
            pickup_lat REAL NOT NULL,
            pickup_lng REAL NOT NULL,
            customer_address TEXT NOT NULL,
            customer_lat REAL NOT NULL,
            customer_lng REAL NOT NULL,
            driver_id INTEGER,
            status TEXT DEFAULT 'Driver Assigned',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (driver_id) REFERENCES drivers (id)
        )
    ''')

    # 3. LOCATIONS TABLE (Stores GPS breadcrumbs from driver device)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL,
            driver_id INTEGER NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (driver_id) REFERENCES drivers (id)
        )
    ''')

    # Seed Demo Driver (D001 / 1234)
    cursor.execute('SELECT * FROM drivers WHERE driver_code = ?', ('D001',))
    driver = cursor.fetchone()
    if not driver:
        cursor.execute('''
            INSERT INTO drivers (driver_code, name, phone, password, status)
            VALUES (?, ?, ?, ?, ?)
        ''', ('D001', 'Rajesh Kumar', '+91 98765 43210', '1234', 'Available'))
        conn.commit()

    cursor.execute('SELECT id FROM drivers WHERE driver_code = ?', ('D001',))
    driver_row = cursor.fetchone()
    driver_id = driver_row['id'] if driver_row else 1

    # Seed Demo Order (DR001 around Poonjar / Kottayam, Kerala)
    cursor.execute('SELECT * FROM orders WHERE id = ?', ('DR001',))
    order = cursor.fetchone()
    if not order:
        cursor.execute('''
            INSERT INTO orders (
                id, product, quantity, customer_name, customer_phone,
                pickup_address, pickup_lat, pickup_lng,
                customer_address, customer_lat, customer_lng,
                driver_id, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'DR001',
            'Fresh Organic Vegetables',
            '5 kg',
            'Demo Customer (Anjali Menon)',
            '+91 94471 23456',
            'Green Valley Organic Farm, Poonjar, Kottayam',
            9.6820,
            76.8150,
            'Hill View Residence, Erattupetta, Kottayam',
            9.6950,
            76.7820,
            driver_id,
            'Driver Assigned'
        ))

        # Initial driver GPS location set at farm pickup
        cursor.execute('''
            INSERT INTO locations (order_id, driver_id, latitude, longitude)
            VALUES (?, ?, ?, ?)
        ''', ('DR001', driver_id, 9.6820, 76.8150))
        conn.commit()

    conn.close()

# Authentication Decorator
def login_required(f):
    """Protects driver routes from unauthorized access."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'driver_id' not in session:
            flash('Please log in first to access the driver portal.', 'warning')
            return redirect(url_for('driver_login'))
        return f(*args, **kwargs)
    return decorated_function

# ==================================================================
# WEB USER INTERFACE ROUTES
# ==================================================================

@app.route('/')
def home():
    """Portal Landing Page providing access to Driver & Customer portals."""
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def driver_login():
    """Driver authentication page."""
    if request.method == 'POST':
        driver_code = request.form.get('driver_code', '').strip()
        password = request.form.get('password', '').strip()

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM drivers WHERE driver_code = ? AND password = ?', (driver_code, password))
        driver = cursor.fetchone()
        conn.close()

        if driver:
            session['driver_id'] = driver['id']
            session['driver_code'] = driver['driver_code']
            session['driver_name'] = driver['name']
            flash(f'Welcome back, {driver["name"]}!', 'success')
            return redirect(url_for('driver_dashboard'))
        else:
            flash('Invalid Driver ID or Password. Demo credentials: D001 / 1234', 'danger')

    return render_template('driver_login.html')

@app.route('/logout')
def driver_logout():
    """Logs out the driver and clears session."""
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('driver_login'))

@app.route('/driver')
@login_required
def driver_dashboard():
    """Driver main dashboard showing statistics, quick actions, and active order."""
    driver_id = session['driver_id']
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM drivers WHERE id = ?', (driver_id,))
    driver = cursor.fetchone()

    # Deliveries Count: Pending
    cursor.execute('SELECT COUNT(*) as count FROM orders WHERE driver_id = ? AND status IN (?, ?)',
                   (driver_id, 'Driver Assigned', 'Driver Accepted'))
    pending_count = cursor.fetchone()['count']

    # Deliveries Count: Active (In transit)
    cursor.execute('SELECT COUNT(*) as count FROM orders WHERE driver_id = ? AND status IN (?, ?)',
                   (driver_id, 'Picked Up', 'Out for Delivery'))
    active_count = cursor.fetchone()['count']

    # Deliveries Count: Completed
    cursor.execute('SELECT COUNT(*) as count FROM orders WHERE driver_id = ? AND status = ?',
                   (driver_id, 'Delivered'))
    completed_count = cursor.fetchone()['count']

    # Fetch active order (or latest order)
    cursor.execute('''
        SELECT * FROM orders 
        WHERE driver_id = ? AND status != 'Delivered'
        ORDER BY created_at DESC LIMIT 1
    ''', (driver_id,))
    active_order = cursor.fetchone()

    # Fallback to latest order if all are delivered
    if not active_order:
        cursor.execute('SELECT * FROM orders WHERE driver_id = ? ORDER BY created_at DESC LIMIT 1', (driver_id,))
        active_order = cursor.fetchone()

    conn.close()

    return render_template(
        'driver_dashboard.html',
        driver=driver,
        pending_count=pending_count,
        active_count=active_count,
        completed_count=completed_count,
        active_order=active_order,
        stages=STATUS_STAGES
    )

@app.route('/driver/deliveries')
@login_required
def driver_deliveries():
    """List of all delivery orders assigned to this driver."""
    driver_id = session['driver_id']
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM orders WHERE driver_id = ? ORDER BY created_at DESC', (driver_id,))
    orders = cursor.fetchall()
    cursor.execute('SELECT * FROM drivers WHERE id = ?', (driver_id,))
    driver = cursor.fetchone()
    conn.close()

    return render_template('deliveries.html', orders=orders, driver=driver, stages=STATUS_STAGES)

@app.route('/driver/order/<order_id>')
@login_required
def driver_order_detail(order_id):
    """Detailed view for driver to update status, track route, and broadcast GPS."""
    driver_id = session['driver_id']
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM orders WHERE id = ? AND driver_id = ?', (order_id, driver_id))
    order = cursor.fetchone()
    cursor.execute('SELECT * FROM drivers WHERE id = ?', (driver_id,))
    driver = cursor.fetchone()
    conn.close()

    if not order:
        flash('Order not found or not assigned to you.', 'danger')
        return redirect(url_for('driver_dashboard'))

    return render_template('delivery_details.html', order=order, driver=driver, stages=STATUS_STAGES)

@app.route('/driver/toggle_status', methods=['POST'])
@login_required
def toggle_driver_status():
    """Toggle driver availability: Available <-> Offline."""
    driver_id = session['driver_id']
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT status FROM drivers WHERE id = ?', (driver_id,))
    current = cursor.fetchone()['status']
    new_status = 'Offline' if current == 'Available' else 'Available'

    cursor.execute('UPDATE drivers SET status = ? WHERE id = ?', (new_status, driver_id))
    conn.commit()
    conn.close()

    flash(f'Driver status changed to: {new_status}', 'info')
    return redirect(url_for('driver_dashboard'))

@app.route('/customer')
@app.route('/customer/<order_id>')
def customer_tracking(order_id='DR001'):
    """Customer-facing delivery tracking page with Flipkart-style interactive map."""
    req_order_id = request.args.get('order_id', order_id)
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT o.*, d.name as driver_name, d.phone as driver_phone, d.driver_code
        FROM orders o
        LEFT JOIN drivers d ON o.driver_id = d.id
        WHERE o.id = ?
    ''', (req_order_id,))
    order = cursor.fetchone()
    conn.close()

    return render_template('customer_tracking.html', order=order, order_id=req_order_id, stages=STATUS_STAGES)

@app.route('/reset_demo', methods=['POST', 'GET'])
def reset_demo():
    """Convenience helper to reset the demo order for college viva demonstrations."""
    conn = get_db()
    cursor = conn.cursor()

    # Reset demo order status back to 'Driver Assigned'
    cursor.execute('''
        UPDATE orders 
        SET status = 'Driver Assigned'
        WHERE id = 'DR001'
    ''')

    # Reset driver location back to pickup farm coordinates
    cursor.execute('DELETE FROM locations WHERE order_id = "DR001"')
    cursor.execute('''
        INSERT INTO locations (order_id, driver_id, latitude, longitude)
        VALUES ('DR001', 1, 9.6820, 76.8150)
    ''')
    conn.commit()
    conn.close()

    flash('Demo order DR001 reset back to initial stage!', 'success')
    return redirect(url_for('home'))

# ==================================================================
# REST API ENDPOINTS (JSON)
# ==================================================================

@app.route('/api/order', methods=['GET'])
def api_get_order():
    """
    Returns JSON details for an order, including current status and stage index.
    Called by customer and driver tracking pages.
    """
    order_id = request.args.get('order_id', 'DR001')
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT o.*, d.name as driver_name, d.phone as driver_phone, d.driver_code
        FROM orders o
        LEFT JOIN drivers d ON o.driver_id = d.id
        WHERE o.id = ?
    ''', (order_id,))
    order = cursor.fetchone()
    conn.close()

    if not order:
        return jsonify({'success': False, 'message': 'Order not found'}), 404

    order_data = dict(order)
    current_status = order_data.get('status', 'Order Placed')
    status_index = STATUS_STAGES.index(current_status) if current_status in STATUS_STAGES else 0

    order_data['status_index'] = status_index

    return jsonify({
        'success': True,
        'order': order_data,
        'stages': STATUS_STAGES
    })

@app.route('/api/order/status', methods=['POST'])
def api_update_order_status():
    """
    Updates the delivery status of an order.
    Called from Driver interface when clicking status progression buttons.
    """
    data = request.get_json() or {}
    order_id = data.get('order_id')
    new_status = data.get('status')

    if not order_id or not new_status:
        return jsonify({'success': False, 'message': 'order_id and status are required'}), 400

    if new_status not in STATUS_STAGES:
        return jsonify({'success': False, 'message': f'Invalid status. Must be one of: {STATUS_STAGES}'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('UPDATE orders SET status = ? WHERE id = ?', (new_status, order_id))
    conn.commit()
    conn.close()

    status_index = STATUS_STAGES.index(new_status)
    return jsonify({
        'success': True,
        'order_id': order_id,
        'new_status': new_status,
        'status_index': status_index
    })

@app.route('/api/driver/location', methods=['POST'])
def api_post_driver_location():
    """
    Receives current GPS coordinates from the driver's browser/device.
    Saves the location into the SQLite 'locations' table.
    """
    data = request.get_json() or {}
    order_id = data.get('order_id')
    driver_id = data.get('driver_id')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not order_id or driver_id is None or latitude is None or longitude is None:
        return jsonify({'success': False, 'message': 'Missing parameters: order_id, driver_id, latitude, longitude'}), 400

    try:
        lat = float(latitude)
        lng = float(longitude)
    except (ValueError, TypeError):
        return jsonify({'success': False, 'message': 'Invalid numerical coordinates'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO locations (order_id, driver_id, latitude, longitude)
        VALUES (?, ?, ?, ?)
    ''', (order_id, driver_id, lat, lng))
    conn.commit()
    conn.close()

    return jsonify({
        'success': True,
        'message': 'Driver location recorded successfully',
        'latitude': lat,
        'longitude': lng
    })

@app.route('/api/driver/location', methods=['GET'])
def api_get_driver_location():
    """
    Retrieves the most recent recorded GPS location for an order.
    Called every 3 seconds by the customer tracking page.
    """
    order_id = request.args.get('order_id', 'DR001')

    conn = get_db()
    cursor = conn.cursor()

    # Get latest location coordinate
    cursor.execute('''
        SELECT latitude, longitude, timestamp
        FROM locations
        WHERE order_id = ?
        ORDER BY id DESC LIMIT 1
    ''', (order_id,))
    loc = cursor.fetchone()

    # Get order metadata and status
    cursor.execute('SELECT status, pickup_lat, pickup_lng, customer_lat, customer_lng FROM orders WHERE id = ?', (order_id,))
    order = cursor.fetchone()
    conn.close()

    if not order:
        return jsonify({'success': False, 'message': 'Order not found'}), 404

    if loc:
        lat = loc['latitude']
        lng = loc['longitude']
        timestamp = loc['timestamp']
    else:
        # Fallback to pickup latitude & longitude if driver has not transmitted location yet
        lat = order['pickup_lat']
        lng = order['pickup_lng']
        timestamp = None

    return jsonify({
        'success': True,
        'order_id': order_id,
        'latitude': lat,
        'longitude': lng,
        'timestamp': timestamp,
        'order_status': order['status']
    })

# ==================================================================
# APPLICATION ENTRYPOINT
# ==================================================================
if __name__ == '__main__':
    # Initialize the database and seed data
    init_db()
    print("==================================================")
    print("DRISHTI - Delivery & Driver Module")
    print("Server running at: http://127.0.0.1:5000")
    print("Driver Login:      http://127.0.0.1:5000/login")
    print("      Demo ID:     D001")
    print("      Password:    1234")
    print("Customer Tracking: http://127.0.0.1:5000/customer")
    print("==================================================")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
