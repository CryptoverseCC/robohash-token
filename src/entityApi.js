import React from 'react';
import etherDiamond from './img/logo.png';

import Web3 from 'web3';
const roboHashTokenArtifacts = require('./abi/RoboHashToken.json');

const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/zMyYPjYpS74gHWKz5ILQ'));
const contractInstance = new web3.eth.Contract(roboHashTokenArtifacts.abi, '0xfa9d471300b0a4cc40ad4dfa5846864973520f45')

export const getEntityData = async entityId => {
  try {
    const responseTokenName = await contractInstance.methods.getTokenName(entityId).call();
    const responseTokenUrl = await contractInstance.methods.getTokenUrl(entityId).call(); 
    const tokenName = responseTokenName.valueOf();
    const tokenUrl = responseTokenUrl.valueOf();
    return {
      id: entityId,
      name: tokenName,
      image_url: tokenUrl,
      url: `https://robohash.org`,
      color: '#333333'
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const EntityIcon = entityId => {
  return <img src={etherDiamond} style={{ height: '70%' }} alt={entityId} />;
};

export const entityTranslations = {
  commentPlaceholder: 'Hash your story',
  replyPlaceholder: 'Hash your reply',
  noEntitiesError: 'No robohashes found',
  entityName: 'RoboHash'
};

export const avatarSizes = {
  verySmall: { containerSize: '32px', imgSize: '32px', imgTopOffset: '50%', imgLeftOffset: '50%' },
  small: { containerSize: '44px', imgSize: '44px', imgTopOffset: '50%', imgLeftOffset: '50%' },
  medium: { containerSize: '54px', imgSize: '54px', imgTopOffset: '50%', imgLeftOffset: '50%' },
  large: { containerSize: '64px', imgSize: '64px', imgTopOffset: '50%', imgLeftOffset: '50%' }
};
