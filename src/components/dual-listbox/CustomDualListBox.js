import React from 'react'
import DualListBox from 'react-dual-listbox'
import 'react-dual-listbox/lib/react-dual-listbox.css'

const options = [
    {value: 'one', label: 'Option one'},
    {value: 'two', label: 'Option two'},
];

class CustomDualListBox extends React.Component {
    state = {
        selected: [options[0]],
    };

    onChange = (selected) => {
        console.log(selected);
        this.setState({selected});
    };

    render () {
        const { selected } = this.state;
 
        return (
            <DualListBox
                options={options}
                selected={selected}
                allowDuplicates
                simpleValue={false}
                onChange={this.onChange}
            />
        );
    }
}

export default CustomDualListBox
