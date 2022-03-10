export interface PersonaGestion {
    idPersonaGestion?: number;
    idUser?: string;
    idTipoPersona?: number;
    idTipoDocumento?: number;
    numeroDocumento?: string;
    razonSocial?: string;
    nombres?: string;
    apellidos?: string;
    profesionOficio?: string;
    email?: string;
    idTipoIdentificacionRl?: number;
    numeroIdentificacionRl?: string;
    nombresRl?: string;
    apellidosRl?: string;
    direccion?: string;
    codigoPostal?: string;
    idPais?: number;
    idEstadoDepartamento?: number;
    idCiudad?: number;
    telefonoFijo?: string;
    telefonoCelular?: string;
    nombresContacto?: string;
    apellidosContacto?: string;
    telefonoFijoContacto?: string;
    telefonoCelularContacto?: string;
    estado?: string;
    fechaHoraRegistro?: Date;
  }
  