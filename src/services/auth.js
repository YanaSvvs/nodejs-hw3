import crypto from 'crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

const generateToken = () => crypto.randomBytes(32).toString('base64');

export const createSession = async (userId) => {
  const accessToken = generateToken();
  const refreshToken = generateToken();

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const { accessToken, refreshToken } = session;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: FIFTEEN_MINUTES, 
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
};

export const clearSessionCookies = (res) => {
  res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'none' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
  res.clearCookie('sessionId', { httpOnly: true, secure: true, sameSite: 'none' });
};