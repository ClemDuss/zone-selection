/***
 * 
 * Composant ZoneSelect
 * 
 * @version 1.0.0
 * 
 * @author Clément DUSSOLLIER
 * 
 */

class ZoneSelect{
    constructor(pdfZoneId){
        this.pdfZone = document.querySelector(`#${pdfZoneId}`);

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

    getData(){
        //Calcul des différence de manière à bien prendre les coordonnées depuis le coin haut-gauche de l'élément parent
        const differenceX = this.pdfZone.getBoundingClientRect().left
        const differenceY = this.pdfZone.getBoundingClientRect().top

        //de manière à ne pas manipuler directement la zone sélectionnée par l'utilisateur
        let resultSelectedZone = {start:{x:0,y:0},end:{x:0,y:0},width:0,height:0} 
        
        resultSelectedZone.start.x  = this.selectedZone.start.x - differenceX
        resultSelectedZone.end.x    = this.selectedZone.end.x - differenceX
        resultSelectedZone.start.y  = this.selectedZone.start.y - differenceY
        resultSelectedZone.end.y    = this.selectedZone.end.y - differenceY

        resultSelectedZone.width    = this.selectedZone.end.x - this.selectedZone.start.x;
        resultSelectedZone.height   = this.selectedZone.end.y - this.selectedZone.start.y;
        return resultSelectedZone;
    }

    /**
     * Initialisation des éléments nécessaires au fonctionnement de la sélection
     */
    initialize(){
        this.deleteSelectedZoneIfExists()

        //  Create the DIV for the selection zone
        this.tamponDiv.id                = 'tampon';
        this.tamponDiv.style.border      = '2px solid red';
        this.tamponDiv.style.position    = 'fixed';
        this.tamponDiv.style.display     = 'none';
        this.pdfZone.append(this.tamponDiv);
        this.pdfZone.style.cursor = 'crosshair';

        document.onmousemove = (e) => {
            this.drawZone(e);
        }

        this.pdfZone.onmousedown = (e) => {this.startDraw(e)}

        document.onmouseup = (e) => {
            this.drawing = false;
        }
    }

    /**
     * Permet de tétruire l'objet courant
     */
    destroy(){
        this.deleteSelectedZoneIfExists();
        this.pdfZone.style.cursor = 'auto'
        this.pdfZone.removeEventListener('onmousedown', this.startDraw)
        this.pdfZone.removeEventListener('onmousemove', this.drawZone)

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
        
        let minY = this.pdfZone.getBoundingClientRect().top;
        let minX = this.pdfZone.getBoundingClientRect().left;
        let maxY = minY + this.pdfZone.offsetHeight - 4;
        let maxX = minX + this.pdfZone.offsetWidth - 4;

        //  Calcul des positions en X
        if(e.clientX > this.startPoint.x){
            this.selectedZone.start.x = this.startPoint.x;
            this.selectedZone.end.x = ((e.clientX > maxX) ? maxX : e.clientX);
        }else{
            this.selectedZone.start.x = ((e.clientX < minX) ? minX : e.clientX);
            this.selectedZone.end.x = this.startPoint.x;
        }

        //  Calcul des positions Y
        if(e.clientY > this.startPoint.y){
            this.selectedZone.start.y = this.startPoint.y;
            this.selectedZone.end.y = ((e.clientY > maxY) ? maxY : e.clientY);
        }else{
            this.selectedZone.start.y = ((e.clientY < minY) ? minY : e.clientY);
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

        this.startPoint.x = e.clientX;
        this.startPoint.y = e.clientY;

        this.selectedZone.start.x   = e.clientX;
        this.selectedZone.start.y   = e.clientY;
        this.selectedZone.end.x     = e.clientX;
        this.selectedZone.end.y     = e.clientY;

        this.tamponDiv.style.left     = (this.selectedZone.start.x - 2) + 'px'
        this.tamponDiv.style.top      = (this.selectedZone.start.y - 2) + 'px'
        this.tamponDiv.style.width    = '0px'
        this.tamponDiv.style.height   = '0px'
        this.tamponDiv.style.display  = 'none'
    }

}