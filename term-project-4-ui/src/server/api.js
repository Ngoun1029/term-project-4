import url from "./url"

// sign up and sign in
export const signIn = async(SignInParam)=>{
    try{
        const param = SignInParam;
        const response = await url.post('/api/user-sign-in',{
            email : param.email,
            password : param.password
           
        },{
            headers:{
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    
    }
    catch(error){
        console.log('error message:', error);
    }

}

export const signUp = async(SignUpParam) =>{
    const param = SignUpParam;
    try{
        const response = await url.post('/api/user-sign-up', {
            first_name : param.first_name,
            last_name : param.last_name,
            gender : param.gender,
            email : param.email,
            password : param.password,
            confirm_password : param.confirm_password,
            contact : param.contact,
            profile_picture : param.profile_picture,
            user_name : param.user_name,
            birthdate : param.birthdate,
        },{
            headers: {
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

export const logout = async(token)=>{
    try{
        const response = await url.post('/api/user-sign-out', {
            headers: {
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

// otp

export const emailVerification = async(EmailVerificationParam)=>{
    const param = EmailVerificationParam;
    try{
        const response = await url.post('/api/email-verification', {
            email : param.email,
        },{
            headers: {
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data; 
    }
    catch(error){
        console.log('error message:', error);
    }
}

export const emailCodeVerification = async(EmailCodeVerificationParam) =>{
    const param = EmailCodeVerificationParam;
    try{
        const response = await url.post('/api/code-verification-email',{
            email : param.email,
            verification_code : param.verification_code,
        },{
            headers: {
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

export const resendVerificationCode = async(ResendVerificationCodeParam)=>{
    const param = ResendVerificationCodeParam;
    try{
        const response = await url.post('/api/resend-verification-code', {
            email : param.email,
        },{
            headers: {
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

export const removeVerificationCode = async(RemoveVerificationCodeParam)=>{
    const param = RemoveVerificationCodeParam;
    try{
        const response = await url.delete('/api/remove-verification-code', {
            email : param.email,
        },{
            headers: {
                
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:',error); 
    }
}

//user

export const userProfile = async(token)=>{
    try{
        const response = await url.get('/api/user-profile', {
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:',error); 
    }
}


export const userEdit = async(UserUpdateParam, token) =>{
    const param = UserUpdateParam;
    try{
        const response = await url.post('/api/user-edit',{
            user_name :param.user_name,
            profile_picture :param.profile_picture,
        } ,{
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:',error); 
    }
}

//task
export const taskData = async(TaskDataParam, token) => {
    const param = TaskDataParam;
    try{
        const response = await url.post('/api/task-view/data', {
            page : param.page,
            range : param.range,
        },{
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:',error); 
    }
}

export const taskCreate = async(TaskCreateParam, token)=>{
    const param = TaskCreateParam;
    try{
        const response = await url.post('/api/task-create',{
            categories : param.categories,
            title : param.title,
            description : param.description,
            deadline : param.deadline,
            emergent_level : param.emergent_level,
        },{
            headers:{
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

export const taskUpdate = async (TaskUpdateParam, token)=>{
    const param = TaskUpdateParam;
    try{
        const response = await url.post('/api/task-edit', {
            task_id : param.task_id,
            categories: param.categories,
            title: param.title,
            description: param.description,
            deadline: param.deadline,
            emergent_level : param.emergent_level,
            progress: param.progress

        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

export const taskDetail = async(taskId, token)=>{
    try{
        const response = await url.get(`/api/task-view-detail${taskId}`,{
            headers :{
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

export const taskDelete = async(taskId, token)=>{
    try{
        const response = await url.delete(`/api/task-remove${taskId}`,{
            headers :{
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch(error){
        console.log('errror message:', error);
    }
}

//notification

export const notificationRead = async (notificationId, token)=>{
    try{
        const response = await url.put(`/api/notification-read/${notificationId}`,{
            headers:{
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error)
    }
}

export const notificationData = async(NotificationDataParam, token)=> {
    const param = NotificationDataParam;
    try{
        const response = await url.post('/api/notification-view/data', {
            page: param.page,
            range : param.range,
        }, {
            headers:{
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }   
    catch(error){
        console.log('error message:', error);
    }
}

export const notificationDelete = async(notificationId, token)=>{
    try{
        const response = await url.delete(`/api/notification-remove${notificationId}`,{
            headers:{
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

//setting

export const emailUpdate = async(EmailUpdateParam, token)=>{
    const param = EmailUpdateParam;
    try{
        const response = await url.post('/api/email-edit', {
            new_email :param.new_email,
            confirm_email : param.confirm_email,
        },{
            headers:{
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

export const passwordUpdate = async(PasswordUpdateParam, token)=>{
    const param = PasswordUpdateParam;
    try{
        const response = await url.post('/api/password-edit', {
            new_password :param.new_password,
            confirm_password : param.confirm_password,
        },{
            headers:{
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}

export const informationEdit = async(InformationUpdateParam, token)=>{
    const param = InformationUpdateParam;
    try{
        const response = await url.post('/api/information-edit', {
            first_name :param.first_name,
            last_name : param.last_name,
            birthdate : param.birthdate,
            contact : param.contact,
        },{
            headers:{
                "Authorization": `Bearer ${token}`,
                "X-CSRF-TOKEN": "",
                "Content-Type": "application/json",
            }
        });
        return response.data;
    }
    catch(error){
        console.log('error message:', error);
    }
}