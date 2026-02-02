import { Request, Response } from "express";
import axios from "axios";
import {
  googleOAuthConfig,
  githubOAuthConfig
} from "../config/oauth";
import { handleOAuthLogin } from "../services/oauth.service";

const API_URL = process.env.API_URL || "http://localhost:9090";


export const googleAuth = (_: Request, res: Response) => {
  try {
    const url =
      `${googleOAuthConfig.authUrl}?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${API_URL}/api/auth/google/callback` +
      `&response_type=code` +
      `&scope=${googleOAuthConfig.scope}`;

    res.redirect(url);
  } catch (err) {
    console.error("Google Auth Redirect Error:", err);
    res.status(500).json({
      error: "Unable to initiate Google authentication"
    });
  }
};


export const githubAuth = (_: Request, res: Response) => {
  try {
    const url =
      `${githubOAuthConfig.authUrl}?` +
      `client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${API_URL}/api/auth/github/callback` +
      `&scope=${githubOAuthConfig.scope}`;

    res.redirect(url);
  } catch (err) {
    console.error("GitHub Auth Redirect Error:", err);
    res.status(500).json({
      error: "Unable to initiate GitHub authentication"
    });
  }
};


export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Authorization code missing"
      });
    }

    const tokenRes = await axios.post(googleOAuthConfig.tokenUrl, {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${API_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
      code
    });

    const userRes = await axios.get(googleOAuthConfig.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenRes.data.access_token}`
      }
    });

    const tokens = await handleOAuthLogin(
      "google",
      userRes.data.id,
      userRes.data.email,
      userRes.data.name
    );

    res.json(tokens);
  } catch (err) {
    console.error("Google OAuth Callback Error:", err);
    res.status(401).json({
      error: "Google authentication failed"
    });
  }
};


export const githubCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Authorization code missing"
      });
    }

    const tokenRes = await axios.post(
      githubOAuthConfig.tokenUrl,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      { headers: { Accept: "application/json" } }
    );

    const userRes = await axios.get(githubOAuthConfig.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenRes.data.access_token}`
      }
    });

    const tokens = await handleOAuthLogin(
      "github",
      String(userRes.data.id),
      userRes.data.email || `${userRes.data.id}@github.com`,
      userRes.data.name || userRes.data.login
    );

    res.json(tokens);
  } catch (err) {
    console.error("GitHub OAuth Callback Error:", err);
    res.status(401).json({
      error: "GitHub authentication failed"
    });
  }
};
