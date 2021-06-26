import React from 'react';
import styled from '@emotion/styled';
import { formatRelative } from 'date-fns'

const LastUpdatedDiv = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 0;
  padding: 20px;
  font-family: Roboto, Arial, sans-serif;
  font-weight: 400;
  border-radius: 2px;
  background-color: white;
  height: auto;
  box-shadow: rgb(0 0 0 / 30%) 0px 1px 4px -1px;
`;

export const LastUpdated = ({ updatedAt }: { updatedAt: number }) => {
  return (
    <LastUpdatedDiv title={new Date(updatedAt).toLocaleString()}>
      Last updated:
      <br />
      <b>{formatRelative(new Date(updatedAt), new Date())}</b>
    </LastUpdatedDiv>
  );
}

export default LastUpdated;
