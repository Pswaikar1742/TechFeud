# Tech Feud Game Show Application

## Overview

Tech Feud is a real-time web application for hosting a live technology-themed game show. The application features a dual-interface system with a private admin dashboard for game control and a public presenter screen for audience display. The game involves 10 contestants answering technology-related questions with ranked answers, similar to the popular Family Feud format but focused on tech topics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: HTML5, Tailwind CSS, and modern vanilla JavaScript (ES6+)
- **Design Pattern**: Server-side rendered templates using Jinja2 with real-time updates via Server-Sent Events (SSE)
- **UI Components**: Two main interfaces - admin dashboard (`/admin`) and presenter screen (`/`)
- **Styling Framework**: Tailwind CSS with custom game-themed color palette and typography
- **Animation Library**: Custom CSS animations for answer reveals and card flips

### Backend Architecture
- **Framework**: Flask web application with SQLAlchemy ORM
- **Architecture Pattern**: MVC (Model-View-Controller) with separate route handlers
- **Database Layer**: SQLAlchemy with DeclarativeBase for ORM operations
- **Session Management**: Flask sessions with configurable secret key
- **Real-time Updates**: Server-Sent Events (SSE) for pushing game state changes to clients

### Data Storage Solutions
- **Primary Database**: SQLite for development with PostgreSQL support via environment configuration
- **Connection Pooling**: Configured with pool recycling and pre-ping for reliability
- **Database Schema**: 
  - `GameState` table for managing game flow and visibility states
  - `Contestant` table for player information and scores
  - `Answer` table for tracking responses and point awards
- **Data Persistence**: Game state, contestant information, and scoring data stored persistently

### Authentication and Authorization
- **Security Model**: No explicit authentication system implemented
- **Access Control**: Admin dashboard accessible without restrictions
- **Session Security**: Configurable session secret key via environment variables

### Game Logic Architecture
- **Question System**: Hard-coded question data in Python module with ranked answers
- **Turn Management**: Sequential turn-based system with configurable direction
- **Scoring System**: Point-based scoring with answer reveals and contestant tracking
- **State Management**: Centralized game state with real-time synchronization between admin and presenter views

## External Dependencies

### Third-party Libraries
- **Flask**: Web framework for Python applications
- **SQLAlchemy**: Object-Relational Mapping (ORM) library
- **Werkzeug**: WSGI utility library with ProxyFix middleware
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Font Awesome**: Icon library (via CDN)
- **Google Fonts**: Orbitron font family for game aesthetics

### Development Tools
- **Python Runtime**: Standard library modules for JSON handling, datetime operations, and logging
- **Database Support**: SQLite (default) with PostgreSQL compatibility
- **Environment Configuration**: Environment variable support for database URLs and session secrets

### Browser APIs
- **Server-Sent Events (SSE)**: For real-time communication between server and presenter screen
- **Fetch API**: For AJAX requests from admin dashboard
- **DOM Manipulation**: Native JavaScript for dynamic UI updates

### Hosting Considerations
- **WSGI Compatibility**: ProxyFix middleware for reverse proxy deployments
- **Database Flexibility**: Environment-configurable database URLs for different deployment scenarios
- **Static Assets**: Local static file serving with Flask's built-in static file handler