from database import create_tables, engine
from models import Base
import sys

def init_database():
    """Initialize the database with all tables"""
    try:
        print("Creating database tables...")
        create_tables()
        print("[OK] Database tables created successfully!")
        
        # Verify tables were created
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"Tables created: {tables}")
        
        expected_tables = ['users', 'medical_reports', 'patient_history']
        missing_tables = [table for table in expected_tables if table not in tables]
        
        if missing_tables:
            print(f"[WARN] Warning: Missing tables: {missing_tables}")
        else:
            print("[OK] All expected tables are present!")
            
    except Exception as e:
        print(f"[ERROR] Error creating database tables: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_database()