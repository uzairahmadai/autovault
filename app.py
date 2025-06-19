from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///autovault.db'
db = SQLAlchemy(app)

# Models
class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    mileage = db.Column(db.String(50))
    fuel_type = db.Column(db.String(50))
    transmission = db.Column(db.String(50))
    image = db.Column(db.String(200))
    description = db.Column(db.Text)
    features = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100))
    author = db.Column(db.String(100))
    image = db.Column(db.String(200))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/cars')
def get_cars():
    cars = Car.query.all()
    return jsonify([{
        'id': car.id,
        'title': car.title,
        'price': car.price,
        'mileage': car.mileage,
        'fuel_type': car.fuel_type,
        'transmission': car.transmission,
        'image': car.image
    } for car in cars])

@app.route('/api/cars/<int:id>')
def get_car(id):
    car = Car.query.get_or_404(id)
    return jsonify({
        'id': car.id,
        'title': car.title,
        'price': car.price,
        'mileage': car.mileage,
        'fuel_type': car.fuel_type,
        'transmission': car.transmission,
        'image': car.image,
        'description': car.description,
        'features': car.features
    })

@app.route('/api/blogs')
def get_blogs():
    blogs = Blog.query.all()
    return jsonify([{
        'id': blog.id,
        'title': blog.title,
        'category': blog.category,
        'author': blog.author,
        'image': blog.image,
        'created_at': blog.created_at.strftime('%B %d, %Y')
    } for blog in blogs])

@app.route('/api/blogs/<int:id>')
def get_blog(id):
    blog = Blog.query.get_or_404(id)
    return jsonify({
        'id': blog.id,
        'title': blog.title,
        'category': blog.category,
        'author': blog.author,
        'image': blog.image,
        'content': blog.content,
        'created_at': blog.created_at.strftime('%B %d, %Y')
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
