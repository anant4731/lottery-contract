import React, { useEffect, useState } from "react";
import lottery from "./lottery";
import "./styles.css";
import web3 from "./web3";

export default function App() {
  const pickWinnerFormHandler = async (e) => {
    const accounts = await web3.eth.getAccounts();
    setWaitingMsg("processing...");
    e.preventDefault();
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    setWaitingMsg("A WINNER HAS BEEN PICKED!");
  };
  const enterFormSubmitHandler = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    try {
      setWaitingMsg("processing...");
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(etherAmount, "ether")
      });
      setWaitingMsg("YAYYY YOU HAVE ENTERED THE LOTTERY!");
    } catch (err) {
      setWaitingMsg(`SOMETHING WENT WRONG :(, ${err}`);
    }

    setEtherAmount(0);
  };

  // states
  // contract states
  const [manager, setManager] = useState("");
  const [totalPlayers, setTotalPlayers] = useState([]);
  const [balance, setBalance] = useState(0);

  // other states
  const [etherAmount, setEtherAmount] = useState(0);
  const [waitingMsg, setWaitingMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      const manager = await lottery.methods.manager().call();
      const totalPlayers = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);
      setTotalPlayers(totalPlayers);
      setBalance(balance);
    }
    fetchData();
  });
  return (
    <React.Fragment>
      <div className="App">
        <h1>Lottery Contract</h1>
        <h4>Contract manager - {manager}</h4>
        <h5>Total players in the contract are - {totalPlayers.length}</h5>
        <h5>
          Total balance of the contract is -{" "}
          {web3.utils.fromWei(`${balance}`, "ether")} ether
        </h5>
      </div>
      <form onSubmit={enterFormSubmitHandler}>
        <div>
          <input
            onChange={(e) => setEtherAmount(e.target.value)}
            type="number"
            value={etherAmount}
            placeholder="Enter value of ether"
          />
          <button type="submit">Enter Lottery</button>
          <p>{waitingMsg}</p>
          <hr />
        </div>
      </form>
      <form onSubmit={pickWinnerFormHandler}>
        <h3>PICK A WINNER</h3>
        <button type="submit">PICK</button>
      </form>
    </React.Fragment>
  );
}
