import express from 'express';
import passport from 'passport';

const router = express.Router();

// Debug middleware
const debugMiddleware = (req, res, next) => {
    console.log('Debug - Request headers:', req.headers);
    console.log('Debug - Session:', req.session);
    next();
};

// Google OAuth routes
router.get('/google',
    debugMiddleware,
    (req, res, next) => {
        console.log('Starting Google OAuth...');
        next();
    },
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

// router.get('/google/callback',
//     debugMiddleware,
//     (req, res, next) => {
//         console.log('Google OAuth callback received:', {
//             query: req.query,
//             session: req.session
//         });
//         next();
//     },
router.get('/google/callback',
    debugMiddleware,
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // This HTML sends a script to attempt closing the window.
      res.send(`
        <html>
          <head>
            <script>
              function attemptClose() {
                window.open('', '_self');
                window.close();
              }
              // Try to close immediately
              attemptClose();
            </script>
          </head>
          <body>
            <p>Authentication successful! Please close this window.</p>
            <button onclick="attemptClose()">Close</button>
          </body>
        </html>
      `);
    },
    passport.authenticate('google', { 
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
        session: true,
        failureMessage: true
    }),
    (req, res) => {
        try {
            console.log('Authentication successful, user:', req.user);
            
            if (!req.user) {
                console.error('No user object after successful authentication');
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
            }
            
            res.send(`
                <script>
                    try {
                        if (window.opener) {
                            console.log('Sending postMessage to opener');
                            window.opener.postMessage(
                                { 
                                    type: 'AUTH_SUCCESS', 
                                    user: ${JSON.stringify(req.user)}
                                }, 
                                '${process.env.FRONTEND_URL}'
                            );
                            window.close();
                        } else {
                            console.log('No opener found, redirecting');
                            window.location.href = '${process.env.FRONTEND_URL}';
                        }
                    } catch (err) {
                        console.error('Error in callback script:', err);
                        window.location.href = '${process.env.FRONTEND_URL}';
                    }
                </script>
            `);
        } catch (error) {
            console.error('Auth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`);
        }
    }
);

// GitHub OAuth routes
router.get('/github',
    debugMiddleware,
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
    debugMiddleware,
    passport.authenticate('github', { 
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
        session: true
    }),
    (req, res) => {
        try {
            if (!req.user) {
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
            }

            res.send(`
                <script>
                    try {
                        if (window.opener) {
                            window.opener.postMessage(
                                { 
                                    type: 'AUTH_SUCCESS', 
                                    user: ${JSON.stringify(req.user)}
                                }, 
                                '${process.env.FRONTEND_URL}'
                            );
                            window.close();
                        } else {
                            window.location.href = '${process.env.FRONTEND_URL}';
                        }
                    } catch (err) {
                        window.location.href = '${process.env.FRONTEND_URL}';
                    }
                </script>
            `);
        } catch (error) {
            console.error('Auth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`);
        }
    }
);

// Get current user
router.get('/status',
    debugMiddleware,
    (req, res) => {
        try {
            console.log('Status check - Session:', req.session);
            console.log('Status check - User:', req.user);
            
            if (req.isAuthenticated() && req.user) {
                res.json({ user: req.user });
            } else {
                res.status(401).json({ message: 'Not authenticated' });
            }
        } catch (error) {
            console.error('Status check error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Logout route
router.post('/logout',
    debugMiddleware,
    (req, res) => {
        try {
            console.log('Logout - Before logout, session:', req.session);
            req.logout((err) => {
                if (err) {
                    console.error('Logout error:', err);
                    return res.status(500).json({ message: 'Error logging out' });
                }
                console.log('Logout - After logout, before session destroy');
                req.session.destroy((err) => {
                    if (err) {
                        console.error('Session destruction error:', err);
                    }
                    console.log('Logout - Session destroyed');
                    res.json({ message: 'Logged out successfully' });
                });
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Error logging out' });
        }
    }
);

export default router;
