import React, { Component } from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavbarToggler,
    Collapse,
    NavItem
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import Web3 from 'web3';
import '../App.css';
var util;
var util1;

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = { isNavOpen: false };
        this.toggleNav = this.toggleNav.bind(this);
    }

    toggleNav() {
        this.setState({ isNavOpen: !this.state.isNavOpen });
    }
    conver = async (x) => {
        util = Web3.utils.toWei(x, 'milli');
    };
    converb = async (x) => {
        util1 = Web3.utils.fromWei(x, 'milli');
    };
    render() {
        // if (this.props.registered == 1 || this.props.registered == 2) {
        //     return(
        //     <React.Fragment>
        //         <Navbar dark expand="md">
        //             <div className="container justify-center">

        //                 <NavbarToggler onClick={this.toggleNav}/>
        //                 <NavbarBrand className="mr-auto" >BrimNet</NavbarBrand>
        //                 <Collapse isOpen = {this.state.isNavOpen} navbar>

        //                     <Nav navbar className="m-auto">

        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/home">Home</NavLink>
        //                     </NavItem>
        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/items">Items</NavLink>
        //                     </NavItem>
        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/shipment">Shipments</NavLink>
        //                     </NavItem>
        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/register">Register</NavLink>
        //                     </NavItem>

        //                     </Nav>

        //                 </Collapse>
        //             </div>
        //             <h6 style={{ color: "white"}}>Balance : {util1}</h6>
        //         </Navbar>

        //     </React.Fragment>
        //     );
        // }
        // else if (this.props.registered == 3 || this.props.registered == 4) {
        //     return(
        //     <React.Fragment>
        //         <Navbar dark expand="md">
        //             <div className="container justify-center">

        //                 <NavbarToggler onClick={this.toggleNav}/>
        //                 <NavbarBrand className="mr-auto" >BrimNet</NavbarBrand>
        //                 <Collapse isOpen = {this.state.isNavOpen} navbar>

        //                     <Nav navbar className="m-auto">

        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/home">Home</NavLink>
        //                     </NavItem>

        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/register">Register</NavLink>
        //                     </NavItem>

        //                     </Nav>

        //                 </Collapse>
        //             </div>
        //             <h6 style={{ color: "white"}}>Balance : {util1}</h6>
        //         </Navbar>
        //     </React.Fragment>
        //     );
        // }
        // else if (this.props.registered == 5) {
        //     return(
        //         <React.Fragment>
        //         <Navbar dark expand="md">
        //             <div className="container justify-center">

        //                 <NavbarToggler onClick={this.toggleNav}/>
        //                 <NavbarBrand className="mr-auto" >BrimNet</NavbarBrand>
        //                 <Collapse isOpen = {this.state.isNavOpen} navbar>

        //                     <Nav navbar className="m-auto">

        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/home">Home</NavLink>
        //                     </NavItem>
        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/items">Items</NavLink>
        //                     </NavItem>
        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/shipment">Shipments</NavLink>
        //                     </NavItem>
        //                     <NavItem>
        //                         <NavLink className="nav-link" style={{width:200,justifyContent:'space-around'}} to="/allmem">All Members</NavLink>
        //                     </NavItem>

        //                     </Nav>

        //                 </Collapse>
        //             </div>
        //             <h6 style={{ color: "white"}}>Balance : {util1}</h6>
        //         </Navbar>

        //     </React.Fragment>
        //     );
        // }
        return (
            <>
                <Navbar dark expand='md'>
                    <div className='container justify-center'>
                        <NavbarToggler onClick={this.toggleNav} />
                        <NavbarBrand className='mr-auto'>
                            SUPERWORLD
                        </NavbarBrand>
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar className='m-auto'>
                                <NavItem>
                                    <NavLink
                                        className='nav-link'
                                        style={{
                                            width: 200,
                                            justifyContent: 'space-around'
                                        }}
                                        to='/home'
                                    >
                                        Home
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className='nav-link'
                                        style={{
                                            width: 200,
                                            justifyContent: 'space-around'
                                        }}
                                        to='/allart'
                                    >
                                        Arts
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className='nav-link'
                                        style={{
                                            width: 200,
                                            justifyContent: 'space-around'
                                        }}
                                        to='/myart'
                                    >
                                        MyArt
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                    <h6 style={{ color: 'white' }}>
                        <small>{this.props.accounts}</small>
                        <br />
                        <small>
                            Balance :{' '}
                            {Web3.utils.fromWei(
                                this.props.balance.toString(),
                                'ether'
                            )}
                        </small>
                    </h6>
                </Navbar>
            </>
        );
    }
}

export default Header;
