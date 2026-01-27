-- Seed transaction data for account ID 8
-- Make sure account 8 exists first

-- Insert sample payment records
INSERT INTO payments (account_id, amount_paid, paid_at, paypal_reference) VALUES
(8, 500.00, '2026-01-01 10:30:00', 'PAYID-M1234567890ABCDEF'),
(8, 500.00, '2026-01-02 14:15:00', 'PAYID-M2345678901BCDEFG'),
(8, 750.00, '2026-01-10 09:45:00', 'PAYID-M3456789012CDEFGH'),
(8, 1000.00, '2026-01-15 16:20:00', 'PAYID-M4567890123DEFGHI'),
(8, 300.00, '2026-01-20 11:00:00', 'PAYID-M5678901234EFGHIJ'),
(8, 650.00, '2026-01-25 13:30:00', 'PAYID-M6789012345FGHIJK');
