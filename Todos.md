Suggested Improvements to the Document
1. Entity Relationships & Attributes

   Add more details about entity attributes (e.g., Student: name, email, department, enrollmentYear)
   Clarify the relationship between Thesis and ThesisForm
   Define the relationship between Project and other entities
   Specify cardinality of relationships (1-to-1, 1-to-many, etc.)

2. Missing Business Rules

   What happens if a professor doesn’t respond within a certain timeframe?
   Can students resubmit rejected forms?
   Is there a deadline for thesis defense scheduling?
   Maximum number of jury members?
   Minimum number of jury members required?
   Can a professor be both instructor and jury member?

3. API Endpoints

   Complete the Professor endpoints (several are listed but not described)
   Add endpoints for:
   Form status tracking
   Notification system
   Document upload/download
   Time slot management
   Department manager specific endpoints
   Include HTTP methods (GET, POST, PUT, DELETE)
   Add request/response schemas

4. Authentication & Security

   Clarify JWT token expiration and refresh mechanism
   Add password requirements and management
   Define session management rules
   Specify API rate limiting
   Add CORS policy details

5. Technical Specifications

   Database schema or technology choice
   Frontend framework/technology
   Deployment architecture
   Performance requirements
   Scalability considerations

6. Process Clarifications

   Define the “n weeks” configuration parameter default value
   Explain what happens after defense is scheduled
   Add process for handling conflicts or rescheduling
   Define notification mechanisms at each step

7. Additional Features to Consider

   Email/SMS notifications at each step
   Dashboard for different user roles
   Report generation capabilities
   Archive system for completed defenses
   Integration with university systems
   Multi-language support

8. Data Management

   Data retention policies
   Backup and recovery procedures
   Audit trail requirements
   GDPR compliance if applicable

9. User Experience

   Error handling scenarios
   Loading states
   Offline capabilities
   Mobile responsiveness requirements

10. Development Priorities

    Create a proper roadmap with sprints
    Define MVP (Minimum Viable Product) features
    Set clear milestones and deliverables


# TODO: create dml scripts to fill database
# TODO: controllers
# TODO: services