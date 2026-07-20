CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
