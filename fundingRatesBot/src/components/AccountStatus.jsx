import React from "react";
import { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  getAccountBalance,
  getFutureAvailableBalance,
} from "../store/accountSlice/accountThunk.js";
const AccountStatus = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);

  useEffect(() => {
    dispatch(getAccountBalance());
    dispatch(getFutureAvailableBalance());
  }, [dispatch]);

  if (account.loading) return <p>Loading...</p>;
  if (account.error) return <p>Error: {error}</p>;

  return (
    <div>
      <h4>
        Available Spot USDT:
        {account.availableUSDT}
      </h4>
      <h4>
        Available Futures Balance:
        {account.futureAvailableBalance}
      </h4>
      <table>
        <thead>
          <tr>
            <td>Symbol</td>
            <td>Amount</td>
          </tr>
        </thead>
        <tbody>
          {account.balances &&
            account.balances.map((asset) => (
              <tr key={asset.asset}>
                <td>{asset.asset}</td>
                <td>
                  {asset.free}
                  {asset.asset}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(AccountStatus);
