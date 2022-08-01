/***
 * 
 * Composant ZoneSelect
 * 
 * @version 1.0.0
 * 
 * @author Clément DUSSOLLIER
 * 
 */

 const  MODE_TAMPON 				= 1,
        MODE_TAMPON_CONFIGURATION   = 2,
        MODE_SIGNATURE_ELEC 		= 3,
        MODE_ANONYMISATION 			= 4;

class ZoneSelect{
    /**
    * Constructeur de la classe ZoneSelect
    * @param {string} pdfZoneId Id de la zone de sélection
    * @param {number} selectMode Mode d'ouverture du mode lassot
    */
    constructor(pdfZoneId, selectMode){
        this.pdfZone = document.querySelector(`#${pdfZoneId}`);

        this.selectMode = selectMode;

        this.startPoint = {
            x: 0,
            y: 0
        }

        this.selectedZone = {
            start:{
                x: 0,
                y: 0
            },
            end:{
                x: 0,
                y: 0
            },
            width: 0,
            height: 0
        }

        this.startPoint = {x: 0, y: 0};

        this.drawing = false;

        this.tamponDiv = document.createElement('div');

        this.initialize();
    }

    /**
    * Permet de récupérer les coordonnées de la zone sélectionnée
    * @returns Objet contenant les coordonnées
    */
    getData(){
        //de manière à ne pas manipuler directement la zone sélectionnée par l'utilisateur
        let resultSelectedZone = {start:{x:0,y:0},end:{x:0,y:0},width:0,height:0} 
        
        resultSelectedZone.start.x  = this.selectedZone.start.x
        resultSelectedZone.end.x    = this.selectedZone.end.x
        resultSelectedZone.start.y  = this.selectedZone.start.y
        resultSelectedZone.end.y    = this.selectedZone.end.y

        resultSelectedZone.width    = this.selectedZone.end.x - this.selectedZone.start.x;
        resultSelectedZone.height   = this.selectedZone.end.y - this.selectedZone.start.y;
        return resultSelectedZone;
    }

    /**
    * Initialisation des éléments nécessaires au fonctionnement de la sélection
    */
    initialize(){
        this.deleteSelectedZoneIfExists()

        this.pdfZone.style.position = 'relative';

        //  Create the DIV for the selection zone
        this.tamponDiv.id                   = 'tampon';
        this.tamponDiv.style.border         = '2px solid red';
        this.tamponDiv.style.position       = 'absolute';
        this.tamponDiv.style.zIndex         = '999';
        this.tamponDiv.style.display        = 'none';
        switch(this.selectMode){
            case MODE_ANONYMISATION:
                this.tamponDiv.style.backgroundColor = 'rgba(255,255,255,.7)';
                this.tamponDiv.style.border             = '2px dashed red';
                this.tamponDiv.style.backdropFilter     = 'blur(3px)';
                document.querySelector(`#dww${this.pdfZone.id}`).append(this.tamponDiv);
                break;
            default :
                this.pdfZone.append(this.tamponDiv);
                break;
        }
        this.pdfZone.style.cursor           = 'crosshair';

        document.addEventListener('mousemove', (e) => {
            this.drawZone(e);
        })

        this.pdfZone.onmousedown = (e) => {
            if(e.button == 0)
                this.startDraw(e)
        }
        
        document.addEventListener('mouseup', (e) => {
            if(this.drawing){
                this.drawing = false;
                if(this.selectMode == MODE_ANONYMISATION){
                    // Si on est en mode Anonymisation, alors on renvoie les données à notre page principale
                    window.RecupererSelectionMasque(this.selectedZone.start.x,
                                                    this.selectedZone.start.y,
                                                    this.selectedZone.end.x,
                                                    this.selectedZone.end.y,
                                                    this.pdfZone.clientWidth,
                                                    this.pdfZone.clientHeight);
                                                    
                }
            }
        })
    }

    /**
    * Permet de tétruire l'objet courant
    */
    destroy(){
        this.deleteSelectedZoneIfExists();
        this.pdfZone.style.cursor = 'inherit'

        // On supprime tous les 'EventListener' de l'élément PDFZone afin de ne pas causer de bugs
        this.pdfZone.replaceWith(this.pdfZone.cloneNode(true))

        delete this;
    }

    /**
    * Permet de supprimer la zone sélectionné à l'écran si elle est présente
    */
    deleteSelectedZoneIfExists(){
        //On supprime l'éventuel tampon déjà présent dans la page
        //  ce de manière à ne pas cumuler les tampon et perdre le navigateur lors de la récupération des données
        if(document.querySelector('#tampon') != null){
            document.querySelector('#tampon').remove()
        }
    }

    /**
    * Permet de modifier le traçage de la zone en fonciton de l'emplacement du curseur
    * @param {object} e Evénement du déplacement de la souris (onmousemove)
    */
    drawZone(e){
        if(!this.drawing)
            return;
        

        let minY = 0;
        let minX = 0;
        let maxY = minY + this.pdfZone.offsetHeight - 4;
        let maxX = minX + this.pdfZone.offsetWidth - 4;
        const cursorPosition = {
            X: e.clientX - this.pdfZone.getBoundingClientRect().left,
            Y: e.clientY - this.pdfZone.getBoundingClientRect().top
        }

        //  Calcul des positions en X
        if(cursorPosition.X > this.startPoint.x){
            this.selectedZone.start.x = this.startPoint.x;
            this.selectedZone.end.x = ((cursorPosition.X > maxX) ? maxX : cursorPosition.X);
        }else{
            this.selectedZone.start.x = ((cursorPosition.X < minX) ? minX : cursorPosition.X);
            this.selectedZone.end.x = this.startPoint.x;
        }

        //  Calcul des positions Y
        if(cursorPosition.Y > this.startPoint.y){
            this.selectedZone.start.y = this.startPoint.y;
            this.selectedZone.end.y = ((cursorPosition.Y > maxY) ? maxY : cursorPosition.Y);
        }else{
            this.selectedZone.start.y = ((cursorPosition.Y < minY) ? minY : cursorPosition.Y);
            this.selectedZone.end.y = this.startPoint.y;
        }

        this.tamponDiv.style.width = (this.selectedZone.end.x - this.selectedZone.start.x) + 'px'
        this.tamponDiv.style.height = (this.selectedZone.end.y - this.selectedZone.start.y) + 'px'

        this.tamponDiv.style.left = `${this.selectedZone.start.x}px`;
        this.tamponDiv.style.top = `${this.selectedZone.start.y}px`;

        this.tamponDiv.style.display = 'block';

        if(!(this.tamponDiv.offsetHeight > 0 || this.tamponDiv.offsetWidth > 0)){
            this.tamponDiv.style.display = 'none';
        }
    }

    /**
    * Permet de lancer le traçage de la zone de tampon
    * @param {object} e Evenemnt de l'appui sur le bouton gauche de la souris
    */
    startDraw(e){
        e.preventDefault();
        this.drawing = true;

        const cursorPosition = {
            X: e.clientX - this.pdfZone.getBoundingClientRect().left,
            Y: e.clientY - this.pdfZone.getBoundingClientRect().top
        } 

        // Mémorisation du point de départ (curseur)
        this.startPoint.x = cursorPosition.X;
        this.startPoint.y = cursorPosition.Y;

        // Mérmorisation de la zone sélectionnée (0 par 0 à cet instant)
        this.selectedZone.start.x   = cursorPosition.X;
        this.selectedZone.start.y   = cursorPosition.Y;
        this.selectedZone.end.x     = cursorPosition.X;
        this.selectedZone.end.y     = cursorPosition.Y;

        // Mise à jour l'affichage de la zone sélectionnée côté client
        this.tamponDiv.style.left     = (this.selectedZone.start.x - 2 - this.pdfZone.getBoundingClientRect().left) + 'px'
        this.tamponDiv.style.top      = (this.selectedZone.start.y - 2 - this.pdfZone.getBoundingClientRect().top) + 'px'
        this.tamponDiv.style.width    = '0px'
        this.tamponDiv.style.height   = '0px'
        this.tamponDiv.style.display  = 'none'
    }

}



class moveInParent{
    constructor(parentElementId){
        this.parent = document.querySelector(`#${parentElementId}`)

        this.isMoving = false;
        this.keysPressed = [];

        this.startCursorPosition = {x: 0, y: 0};

        this.parent.onmousedown = (e) => {
            if(e.button == 2){
                this.startMoving(e);
                this.parent.style.cursor = 'grabbing';
            }
        }

        document.addEventListener('mousemove', (e) => {
            this.move(e)
        })

        document.addEventListener('mouseup', (e) => {
            this.isMoving = false;
            this.parent.style.cursor = 'inherit';
        })
    }

    startMoving(e){
        this.isMoving = true;
        this.startCursorPosition.x = e.clientX
        this.startCursorPosition.y = e.clientY

        return true;
    }

    move(e){
        if(this.isMoving){
            let startX = this.startCursorPosition.x
            let startY = this.startCursorPosition.y

            this.parent.scrollLeft  += startX - e.clientX
            this.parent.scrollTop   += startY - e.clientY

            this.startCursorPosition.x = e.clientX
            this.startCursorPosition.y = e.clientY
        }
    }
}