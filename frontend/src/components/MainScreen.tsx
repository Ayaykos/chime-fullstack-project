import React from "react";
import { Button, Segment, Loader, Icon, Label, 
  Modal, Input, Checkbox } from 'semantic-ui-react'
import * as MenuAPI from '../apis/Menu';
import "../css/MainScreen.css";

type MainScreenState = {
  items: Array<{ _id: string, name: string, tag: string }>,
  tags: Array<{ _id: string, name: string }>,
  error: Boolean,
  fetching_data: Boolean,
  add_menu_item: Boolean,
  edit_tags: Boolean,
  add_tag_checked: Boolean,
  checked_tag_id: String | null,
  add_menu_item_text: String,
  add_tag_text: String,
  delete_menu_item: Boolean,
  delete_item_id: String | null,
  confirm_delete: Boolean
}

class MainScreen extends React.Component<{}, MainScreenState> {
  state = {
    items: [],
    tags: [],
    fetching_data: true,
    error: false,
    add_menu_item: false,
    edit_tags: false,
    add_tag_checked: false,
    checked_tag_id: null,
    add_menu_item_text: '',
    add_tag_text: '',
    delete_menu_item: false,
    delete_item_id: null,
    confirm_delete: false
  };

  // Fetch items and tags upon mounting component
  componentDidMount(){
    try {
      Promise.all([
        MenuAPI.getMenuItems()
          .catch(()=>{ this.setState({ error: true }) }),
        MenuAPI.getTags()
          .catch(()=>{ this.setState({ error: true }) })
      ])
      .then(([items, tags])=>{
        this.setState({ 
          items: items, 
          tags: tags, 
          fetching_data: false 
        });
      });
    } catch {
      this.setState({ error: true });
    }
  }

  // Items on menu
  MenuItems(){
    const { items, delete_menu_item, confirm_delete, 
      delete_item_id } = this.state;
    return(
      <Segment.Group >
      { items.map((item: { _id: string, name: string, tag: string })=>{
        return (
          <Segment key={item._id} size="tiny">
            <span id="item-text-space">

              {/* Show item name as text and tag as a label if exists */}
              <span id="item-text"> {item.name} </span>
              { item.tag ?
                <Label color='green' tag size="tiny">
                  {item.tag}
                </Label> : null
              }

              {/* If selecting for deletion, confirm or cancel */}
              {delete_menu_item ? 
                confirm_delete && delete_item_id === item._id ?  
                  <Button.Group size="tiny">
                    <Button size="tiny" id="delete-button" color="red"
                      onClick={()=>{this.DeleteMenuItem()}}>Delete</Button>
                    <Button size="tiny" id="delete-button" onClick={()=>{
                      this.setState({confirm_delete: false })
                    }}>Cancel</Button>
                  </Button.Group> :
                  <Icon color="red" link name="remove circle" id="delete-icon"
                    onClick={()=>{
                      this.setState({
                        delete_item_id: item._id,  
                        confirm_delete: true 
                      })
                    }}/>
              : null }
            </span>
          </Segment>
        ) 
      })}
      </Segment.Group>
    )
  }

  // Executes API for adding a menu item
  AddMenuItem(){
    try {
      const { add_menu_item_text, checked_tag_id } = this.state;
      MenuAPI.addMenuItem(add_menu_item_text, checked_tag_id)
        .then(() => { window.location.reload(false); })
        .catch(()=>{ this.setState({ error: true }); })
    } catch {
      this.setState({ error: true });
    }
  }
  // Executes API for deleting a menu item
  DeleteMenuItem(){
    try {
      const { delete_item_id } = this.state;
      MenuAPI.deleteMenuItem(delete_item_id)
        .then(() => { window.location.reload(false); })
        .catch(()=>{ this.setState({ error: true }); })
    } catch {
      this.setState({ error: true });
    }
  }

  // Toggles chosen tag
  toggleAddTagsChecked = () => {
    const { add_tag_checked } = this.state;
    if (!add_tag_checked) {
      this.setState({add_tag_checked: true })
    } else {
      this.setState({add_tag_checked: false, checked_tag_id: null  })
    }    
  }

  // Executes API for adding a tag
  AddTag(){
    try {
      const { add_tag_text } = this.state;
      MenuAPI.addTag(add_tag_text)
        .then(() => { window.location.reload(false); })
        .catch(()=>{ this.setState({ error: true }); })
    } catch {
      this.setState({ error: true });
    }
  }

  // Popup modal for adding menu item
  AddMenuItemModal = () => {
    const { tags, add_menu_item, add_tag_checked, 
      checked_tag_id, add_menu_item_text } = this.state;
    return (
      <Modal
        open={add_menu_item}
        onClose={() => this.setState({ add_menu_item: false })}
      >
        <Modal.Header>Add Menu Item</Modal.Header>
        <Modal.Content>
          <div>Add an item to the menu with an optional tag</div>

          {/* Add item text input and checkbox for choosing if adding tag */}
          <div>
            <Input placeholder='Item name' value={add_menu_item_text}
              onChange={(e)=>{this.setState({
                add_menu_item_text: e.target.value})
              }}/>
          </div>
          <div id="tag-checkbox">
            <Checkbox label='Add a tag' checked={add_tag_checked}
              onChange={this.toggleAddTagsChecked}/>
          </div>
          
          {/* Show current tags for selection if add tag checkbox selected */}
          {add_tag_checked ?
            tags.length > 0 ?
            tags.map((tag: { _id: string, name: string })=>{
              return (
                <Button key={tag._id} size="tiny"
                  color={checked_tag_id===tag._id ? 'green' : 'grey'}
                  onClick={()=>{ this.setState({ checked_tag_id: tag._id }) }}>
                  {tag.name} {' '}
                </Button>
              ) 
            })
            : <span>No tags found. {' '}</span>
          : null }

          {/* Add another tag shortcut if add tag checkbox selected */}
          {add_tag_checked ? 
          <Button icon size='tiny' onClick={()=>{ this.setState({ 
              edit_tags: true,
              add_menu_item: false,
              add_tag_checked: !add_tag_checked
            })}}>
            <Icon name='add' />
            Add Tag
          </Button> : null }
        
        </Modal.Content>

        {/* Confirm to submit changes or cancel to exit modal */}
        <Modal.Actions>
          <Button negative onClick={() => this.setState({ add_menu_item: false })}>
            Cancel
          </Button>
          <Button positive onClick={() => this.AddMenuItem()}
            disabled={add_menu_item_text === '' || (add_tag_checked && !checked_tag_id)}>
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  // Popup modal for adding tag
  AddTagModal = () => {
    const { edit_tags, tags, add_tag_text } = this.state;
    return (
      <Modal
        open={edit_tags}
        onClose={() => this.setState({ edit_tags: false })}
      >
        <Modal.Header>Add Tag</Modal.Header>
        <Modal.Content>
          <div>
          Add a tag to current list tags
          </div>

          {/* Current list of tags */}
          <div>
            {tags.map((tag: { _id: string, name: string })=>{
              return (
                <Label key={tag._id} id="edit-tag-list" tag 
                  color='green' size="tiny">
                  {tag.name} {' '}
                </Label>
              ) 
            })}
          </div>
          <div><br/>

          {/* Text input for adding new tag */}
          <Input placeholder='Tag name' 
            onChange={(e)=>{this.setState({add_tag_text: e.target.value})}}/>
          </div>
        </Modal.Content>

        {/* Confirm to submit changes or cancel to exit modal */}
        <Modal.Actions>
          <Button negative onClick={() => this.setState({ edit_tags: false })}>
            Cancel
          </Button>
          <Button positive onClick={()=>{this.AddTag()}} disabled={add_tag_text === ''}>
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  // Options for Menu: Add Item, Delete Item, Add Tag
  MenuOptions(){
    const { delete_menu_item } = this.state;
    return(
      <div>
        {/* Add item: pops up add item modal */}
        <Button icon color='green' onClick={() => this.setState({ add_menu_item: true })}>
          <Icon name='add' />
          Add Item
        </Button>
        {this.AddMenuItemModal()}

        {/* Delete item: reveals delete buttons for each item */}
        <Button icon color='red' onClick={() => 
          this.setState({ delete_menu_item: !delete_menu_item })}>
          <Icon name='minus' />
          {delete_menu_item ? 'Cancel Delete': 'Delete Item' }
        </Button>

        {/* Add tag: pops up add tag modal */}
        <Button icon onClick={() => this.setState({ edit_tags: true })}>
          <Icon name='add' />
          Add Tag
        </Button>
        {this.AddTagModal()}
        
      </div>
    )
  }
  render() {
    const { fetching_data, error } = this.state;

    // API Error 
    if (error){
      return (
        <div>
          <h3>There has been an error. Please refresh the page.</h3>
        </div>
      )
    }

    // Render Menu (items and options: add item, delete item, add tag)
    return (
      <div>
        <h1>Menu <Icon name='clipboard list'/></h1>
        <h2>Items</h2>
        { fetching_data ?
          <div id="loader">
            <Loader active inline />
          </div> 
          : this.MenuItems()
        }
        {this.MenuOptions()}
      </div>
    );
  }
}

export default MainScreen;