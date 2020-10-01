-- On Sept-29-2020
-- HR To Day End if getting Error as mysql Error Code: 1366. Incorrect string value: '\xD9\x90...."                             ALTER TABLE finance_day_end_header MODIFY COLUMN narration MEDIUMTEXT  
    ALTER TABLE finance_day_end_header MODIFY COLUMN narration MEDIUMTEXT CHARACTER SET utf8mb4 NULL, MODIFY COLUMN voucher_type ENUM('journal', 'contra', 'receipt', 'payment', 'sales', 'purchase', 'credit_note', 'debit_note') CHARACTER SET utf8mb4 NULL COMMENT 'journal,contra,receipt,payment,sales,purchase,credit_note,debit_note', MODIFY COLUMN document_number VARCHAR(45) CHARACTER SET utf8mb4 NULL, MODIFY COLUMN from_screen VARCHAR(45) CHARACTER SET utf8mb4 NULL; MODIFY COLUMN from_screen VARCHAR(45) CHARACTER SET utf8mb4 NULL;

    -- End Sept-29-2020

    ALTER TABLE hims_d_insurance_network_office ADD COLUMN covered_dental ENUM('Y','N') default 'N' 
after dental_max, ADD COLUMN coverd_optical ENUM('Y','N') default 'N' after optical_max;