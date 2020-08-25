from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import request

# import db & models
from models import db, MenuItemModel, TagModel

app = Flask(__name__.split('.')[0])
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///menudb'
db.init_app(app)

"""
Gets all menu items as an array from menu_items table

returns {
    items: [{
        _id: string,
        name: string,
        tag: string
    }]
}
"""
@app.route("/api/menu/", methods=["GET"])
def GetMenuItems():
    try:
        items_query = MenuItemModel.query.all()
        items = []

        for item in items_query:
            items.append({
                '_id': item._id,
                'name' : item.name,
                'tag': item.tag
            })

        return jsonify({
            'items' : items,
            'success': True
        })
    except:
        return {
            'success': False,
            'message': "Error retrieving menu items"
        }, 400

"""
Adds menu item to menu_items table

body: {
    name: string, required (name of item)
    tag_id: string, optional (id of tag to add)
        Note: used id instead of name for more efficient lookup when checking if tag exists
}
"""
@app.route("/api/menu/add", methods=["POST"])
def AddMenuItem():
    try:
        tag_exists = ''
        req = request.get_json()
        name = req['name']
        
        if 'tag_id' in req:
            tag_id = req['tag_id']

            tag_found = db.session.query(TagModel).filter_by(_id=tag_id).scalar()
            
            if tag_found is not None:
                item = MenuItemModel(name=name, tag=tag_found.name)
            else:
                return {
                    'success': False,
                    'message': 'Error adding menu item: tag does not exist'
                }, 400
        else:
            item = MenuItemModel(name=name)
        
        db.session.add(item)
        db.session.commit()

        return { 'success': True }, 201
    except:
        return {
            'success': False,
            'message': 'Error adding menu item'
        }, 400


"""
Deletes item from menu_items table

parameters:
    _id: string, required (id of item to delete)
"""
@app.route("/api/menu/delete", methods = ["DELETE"])
def DeleteMenuItem():
    try:
        _id = request.args.get('_id')
        db.session.query(MenuItemModel).filter_by(_id=_id).delete()
        db.session.commit()
        return { 'success': True }
    except:
        return {
            'success': False,
            'message': 'Error deleting menu item'
        }, 400

"""
Gets all tags as an array from tags table

returns {
    items: [{
        _id: string,
        name: string
    }]
}
"""
@app.route("/api/tags/", methods=["GET"])
def GetTags():
    try:
        tags_query = TagModel.query.all()
        tags = []

        for tag in tags_query:
            tags.append({
                '_id': tag._id,
                'name' : tag.name
            })

        return jsonify({
            'tags' : tags,
            'success': True
        })
    except:
        return {
            'success': False,
            'message': 'Error retrieving tags'
        }, 400

"""
Adds tag to tags table

body: {
    name: string, required (name of tag)
}
"""
@app.route("/api/tags/add", methods=["POST"])
def AddTag():
    try:
        req = request.get_json()
        name = req['name']
    
        tag = TagModel(name=name)
        
        db.session.add(tag)
        db.session.commit()

        return { 'success': True }, 201
    except:
        return {
            'success': False,
            'message': 'Error adding tag'
        }, 400



with app.app_context():
	db.create_all()

if __name__ == "__main__":
    app.run()
