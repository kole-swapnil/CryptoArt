import React, { Component } from 'react';
import BNContract from '../contracts/Cryptoart.json';
import getWeb3 from '../getWeb3';
import '../App.css';
import Header from './HeaderComponent';
import Home from './HomeComponent';
import AllItemComponent from './AllArtComponent';
import MyItemComponent from './MyArtComponent';
import CardDetail from './CardDetail';
import { Switch, Route, Redirect } from 'react-router-dom';
import Footer from './FooterComponent';
import ProtectedRoute from './ProtectedRoute';
//import HDWalletProvider from "@truffle/hdwallet-provider";
let allDocs = [];

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storageValue: 0,
            web3: null,
            accounts: null,
            balance: 0,
            contract: null,
            res: null,
            registered: 0,
            art: null,
            creValue: []
        };
    }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            const balance = await web3.eth.getBalance(accounts[0]);
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = BNContract.networks[networkId];
            const instance = new web3.eth.Contract(
                BNContract.abi,
                deployedNetwork && deployedNetwork.address
            );
            console.log('contract', instance);

            let cre = await instance.getPastEvents('tokencreated', {
                fromBlock: 7970334
            });
            let newArr = [];
            for (let i = 0; i < cre.length; i++) {
                newArr.push(cre[i]);
                console.log(cre[i]);
            }
            this.setState({
                web3,
                accounts: accounts[0],
                contract: instance,
                balance,
                creValue: newArr
            });
            console.log(this.state.creValue);
            let res = await this.state.contract?.methods.tokenCount().call();
            console.log(res);

            let response = [];
            for (let i = 1; i <= res; i++) {
                let rex = await this.state.contract?.methods.Arts(i).call();
                response.push(rex);
            }
            allDocs = [];
            allDocs = response;
            console.log(response);
            this.setState({ art: allDocs });
        } catch (error) {
            // Catch any errors for any of the above operations.

            console.error(error);
        }
    };

    render() {
        const CardWithId = ({ match }) => {
            return (
                <CardDetail
                    art={
                        this.state.art?.filter(
                            (singleart) =>
                                singleart.tokenIdentifier === match.params.id
                        )[0]
                    }
                    contract={this.state.contract}
                    accounts={this.state.accounts}
                    cre={this.state.creValue}
                    matchId={match.params.id}
                />
            );
        };
        return (
            <div className='App'>
                <Header
                    contract={this.state.contract}
                    accounts={this.state.accounts}
                    balance={this.state.balance}
                    web3={this.state.web3}
                />
                <Switch>
                    <Route
                        exact
                        path='/home'
                        component={() => (
                            <Home
                                contract={this.state.contract}
                                accounts={this.state.accounts}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/allart'
                        component={() => (
                            <AllItemComponent
                                contract={this.state.contract}
                                accounts={this.state.accounts}
                            />
                        )}
                    />
                    <ProtectedRoute
                        exact
                        path='/mycollections'
                        component={() => (
                            <MyItemComponent
                                contract={this.state.contract}
                                accounts={this.state.accounts}
                            />
                        )}
                    />
                    <Route path='/card/:id' component={CardWithId} />
                    {/* <Route path='/card/:id'  location={this.state.location} key={this.state.location.key} render = {props => <CardDetail {...props} key={this.sta.location.key} /> } /> */}

                    {/* <Route
                        path='/card/:id'
                        component={(props) => (
                            <CardDetail

                                contract={this.state.contract}
                                accounts={this.state.accounts}
                                art = {this.state.art}
                            />
                        )}
                    /> */}

                    <Redirect to='/home' />
                </Switch>
                <Footer />
            </div>
        );
    }
}
export default Main;
