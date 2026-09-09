import unittest
import json
from app import app, init_db, get_db

class DrishtiDeliveryTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()
        init_db()

    def test_01_database_and_tables(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        self.assertIn('drivers', tables)
        self.assertIn('orders', tables)
        self.assertIn('locations', tables)

        # Check demo driver
        cursor.execute("SELECT * FROM drivers WHERE driver_code = 'D001'")
        driver = cursor.fetchone()
        self.assertIsNotNone(driver)
        self.assertEqual(driver['password'], '1234')

        # Check demo order
        cursor.execute("SELECT * FROM orders WHERE id = 'DR001'")
        order = cursor.fetchone()
        self.assertIsNotNone(order)
        conn.close()
        print("[PASS] Test 01: Database schema and seed data verified.")

    def test_02_landing_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'DRISHTI', response.data)
        print("[PASS] Test 02: Landing page loaded successfully.")

    def test_03_driver_login_flow(self):
        # Invalid credentials
        res_invalid = self.client.post('/login', data={'driver_code': 'D001', 'password': 'wrong'}, follow_redirects=True)
        self.assertIn(b'Invalid Driver ID', res_invalid.data)

        # Valid credentials
        res_valid = self.client.post('/login', data={'driver_code': 'D001', 'password': '1234'}, follow_redirects=True)
        self.assertEqual(res_valid.status_code, 200)
        self.assertIn(b'Rajesh Kumar', res_valid.data)
        self.assertIn(b'Driver Dashboard', res_valid.data)
        print("[PASS] Test 03: Driver login authentication verified.")

    def test_04_driver_order_detail_and_deliveries(self):
        with self.client.session_transaction() as sess:
            sess['driver_id'] = 1
            sess['driver_code'] = 'D001'
            sess['driver_name'] = 'Rajesh Kumar'

        # Deliveries list
        res_list = self.client.get('/driver/deliveries')
        self.assertEqual(res_list.status_code, 200)
        self.assertIn(b'DR001', res_list.data)

        # Order detail page
        res_detail = self.client.get('/driver/order/DR001')
        self.assertEqual(res_detail.status_code, 200)
        self.assertIn(b'Fresh Organic Vegetables', res_detail.data)
        print("[PASS] Test 04: Driver deliveries & order detail views verified.")

    def test_05_api_order_and_status_update(self):
        # GET /api/order
        res = self.client.get('/api/order?order_id=DR001')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['order']['id'], 'DR001')

        # POST /api/order/status -> Update to 'Out for Delivery'
        res_status = self.client.post('/api/order/status',
            data=json.dumps({'order_id': 'DR001', 'status': 'Out for Delivery'}),
            content_type='application/json'
        )
        self.assertEqual(res_status.status_code, 200)
        res_data = json.loads(res_status.data)
        self.assertTrue(res_data['success'])
        self.assertEqual(res_data['new_status'], 'Out for Delivery')
        print("[PASS] Test 05: GET /api/order & POST /api/order/status verified.")

    def test_06_api_driver_location_post_and_get(self):
        # Post new driver coordinates
        new_lat = 9.6890
        new_lng = 76.8000
        res_post = self.client.post('/api/driver/location',
            data=json.dumps({
                'order_id': 'DR001',
                'driver_id': 1,
                'latitude': new_lat,
                'longitude': new_lng
            }),
            content_type='application/json'
        )
        self.assertEqual(res_post.status_code, 200)

        # Customer polling latest location
        res_get = self.client.get('/api/driver/location?order_id=DR001')
        self.assertEqual(res_get.status_code, 200)
        loc_data = json.loads(res_get.data)
        self.assertTrue(loc_data['success'])
        self.assertAlmostEqual(loc_data['latitude'], new_lat, places=4)
        self.assertAlmostEqual(loc_data['longitude'], new_lng, places=4)
        print("[PASS] Test 06: POST & GET /api/driver/location verified.")

    def test_07_customer_tracking_page(self):
        res = self.client.get('/customer?order_id=DR001')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Order #DR001', res.data)
        self.assertIn(b'customer-map', res.data)
        print("[PASS] Test 07: Customer tracking page loaded with map.")

    def test_08_reset_demo(self):
        res = self.client.post('/reset_demo', follow_redirects=True)
        self.assertEqual(res.status_code, 200)

        # Check that status is back to 'Driver Assigned'
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT status FROM orders WHERE id = 'DR001'")
        status = cursor.fetchone()['status']
        conn.close()
        self.assertEqual(status, 'Driver Assigned')
        print("[PASS] Test 08: Reset demo functionality verified.")

if __name__ == '__main__':
    unittest.main()
