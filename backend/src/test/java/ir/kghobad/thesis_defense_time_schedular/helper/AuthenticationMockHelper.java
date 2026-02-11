package ir.kghobad.thesis_defense_time_schedular.helper;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static ir.kghobad.thesis_defense_time_schedular.helper.TestDataBuilder.DEFAULT_PASSWORD;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@Component
public class AuthenticationMockHelper {

    private final MockMvc mockMvc;

    public AuthenticationMockHelper(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    public ResultActions loginRequest(String email, String password) throws Exception {
        String loginJson = String.format("""
            {
                "email": "%s",
                "password": "%s"
            }
            """, email, password);

        return mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson));
    }

    public ResultActions loginAsAdmin() throws Exception {
        return loginRequest("ali.rezai@kntu.ac.ir", DEFAULT_PASSWORD);
    }

    public ResultActions loginAsProfessor() throws Exception {
        return loginRequest("reza.karimi@kntu.ac.ir", DEFAULT_PASSWORD);
    }

    public ResultActions loginAsStudent() throws Exception {
        return loginRequest("ahmad.yousefi@student.kntu.ac.ir", DEFAULT_PASSWORD);
    }

    public ResultActions refreshToken(String refreshToken) throws Exception {
        String refreshJson = String.format("""
            {
                "refreshToken": "%s"
            }
            """, refreshToken);

        return mockMvc.perform(post("/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(refreshJson));
    }
}
