using Bibliocanto.Context;
using Microsoft.EntityFrameworkCore;
using Bibliocanto.Services;
using Bibliocanto.Repository;
using Bibliocanto.IServices;
using Bibliocanto.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Primeiro tenta pegar do appsettings.json, senão pega da variável de ambiente
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");

// Registra o contexto com a string resolvida
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

//String de conexão com o banco de dados
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaulConnection")));

builder.Services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen( c =>
{
    //Habilita a autorização usando Swagger (JWT)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme." +  
            " \r\n\r\n Enter  'Bearer' [space] and then your token in the text input below." +
            "\r\n\r\n Example: \"Bearer 12345abcdef\"",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddScoped<IAuthenticate, AuthenticateService>();

builder.Services.AddScoped<ILivrosService, LivrosService>();
builder.Services.AddScoped<ILivrosRepository, LivrosRepository>();

builder.Services.AddScoped<IAutoresRepository, AutoresRepository>();
builder.Services.AddScoped<IAutoresService, AutoresServices>();

builder.Services.AddScoped<IGenerosRepository, GenerosRepository>();
builder.Services.AddScoped<IGenerosService, GenerosServices>();

builder.Services.AddScoped<IEditorasRepository, EditorasRepository>();
builder.Services.AddScoped<IEditorasService, EditorasServices>();

builder.Services.AddScoped<IMeusLivrosRepository, MeusLivrosRepository>();
builder.Services.AddScoped<IMeusLivrosService, MeusLivrosService>();

builder.Services.AddScoped<IGenerosLivrosRepository, GeneroLivroRepository>();
builder.Services.AddScoped<IGeneroLivroService, GeneroLivroService>();

builder.Services.AddScoped<IAutoresLivrosRepository, AutoresLivroRepository>();
builder.Services.AddScoped<IAutoresLivroService, AutoresLivroService>();

builder.Services.AddScoped<IResenhaRepository, ResenhaRepository>();
builder.Services.AddScoped<IResenhaService, ResenhaService>();

builder.Services.AddScoped<IComentarioRepository, ComentariosRepository>();
builder.Services.AddScoped<IComentarioService, ComentarioService>();

builder.Services.AddScoped<ILikeResenhaRepository, LikeResenhaRespository>();
builder.Services.AddScoped<ILikeResenhaService, LikeResenhaService>();

builder.Services.AddScoped<ILikeComentarioRepository, LikeComentarioRepository>();
builder.Services.AddScoped<ILikeComentarioService, LikeComentarioService>();

builder.Services.AddScoped<EmailService>(sp =>
    new EmailService(sp.GetRequiredService<IConfiguration>())
); 
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<ILikeResenhaRepository, LikeResenhaRespository>();
builder.Services.AddScoped<ILikeResenhaService, LikeResenhaService>();

builder.Services.AddScoped<ILikeComentarioRepository, LikeComentarioRepository>();
builder.Services.AddScoped<ILikeComentarioService, LikeComentarioService>();

builder.Services.AddScoped<IAvaliacaoRepository, AvaliacaoRepository>();
builder.Services.AddScoped<IAvaliacaoService, AvaliacaoService>();

builder.Services.AddScoped<IPerfilRepository, PerfilRepository>();
builder.Services.AddScoped<IPerfilService, PerfilService>();

builder.Services.AddScoped<IDenunciasRepository, DenunciasRepository>();
builder.Services.AddScoped<IDenunciasService, DenunciasService>();

builder.Services.AddScoped<IPreferenciasRepository, PreferenciasRepository>();
builder.Services.AddScoped<IPreferenciasService, PreferenciasService>();

builder.Services.AddScoped<IUnitOFWork, UnitOfWork>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options =>
{
    options.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://192.168.18.180:3000", "http://192.168.18.180:5173", "http://192.168.18.180:5162");
    options.AllowAnyMethod();
    options.AllowAnyHeader();
});

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.SignIn.RequireConfirmedEmail = true;
});
